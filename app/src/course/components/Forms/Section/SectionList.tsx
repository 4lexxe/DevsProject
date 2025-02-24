import { useState } from "react";
import { Edit, Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ContentForm from "@/course/components/forms/content/ContentForm";
import { createSection } from "@/course/services/courseFormService";

import DraggableContentList from "@/course/components/forms/content/DraggableContentList";
import { useSectionContext } from "@/course/context/SectionFormContext";
import { updateSection } from "@/course/services/sectionServices";

export default function SectionList({
  courseId,
  sectionId,
}: {
  courseId: string;
  sectionId?: string;
}) {
  const {
    state: sectionState,
    setSection,
    editSection,
    startEditingSection,
    deleteSection,
  } = useSectionContext();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | undefined>(
    undefined
  );
  const [message, setMessage] = useState<string>();
  const [errors2, setErrors2] = useState<string[]>();
  const navigate = useNavigate();

  const handleCreateSection = async (data: any) => {
    setIsLoading(true);
    try {
      const response = sectionId
        ? await updateSection(sectionId, data)
        : await createSection(data);
        console.log("Esta es la respuesta: ", response)
      setStatus(response.status);
      setMessage(response.message);

      if (response.statusCode === (sectionId ? 200 : 201)) {
        sessionStorage.removeItem("section-form-data")
        setTimeout(() => {
          navigate(`/course/${response.data.courseId}`);

        }, 500)
      }
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error desconocido");
      setStatus("error");
      if (err.response?.data?.errors) {
        setErrors2(err.response.data.errors.map((error: any) => error.msg));
      }
      console.log("Error al crear la sección. Inténtalo nuevamente.", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonClasses = () => {
    const baseClasses =
      "px-6 py-3 text-lg font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-300 hover:scale-105 text-white";

    switch (status) {
      case "success":
        return `${baseClasses} bg-green-500 hover:bg-green-600 focus:ring-green-500`;
      case "error":
        return `${baseClasses} bg-red-500 hover:bg-red-600 focus:ring-red-500`;
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-sm font-medium`;
    }
  };

  const onSubmit = () => {
    console.log(sectionState.section);
    if (!sectionState.section) return;

    const sectionData = {
      ...sectionState.section,
      contents: sectionState.section.contents.map(({ id, ...rest }) => rest), // Eliminar `id` de cada contenido
    };

    const dataToSend = { section: sectionData, courseId };

    // Aquí podrías agregar la lógica para enviar `dataToSend`
    handleCreateSection(dataToSend);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {sectionState.section === null ? (
        <p className="text-gray-500 text-center py-8">Sin secciones añadidas</p>
      ) : (
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {sectionState.section.coverImage && (
                  <img
                    src={sectionState.section.coverImage || "/placeholder.svg"}
                    alt={sectionState.section.title}
                    className="w-full sm:w-48 h-48 object-cover rounded-md"
                  />
                )}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {sectionState.section.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {sectionState.section.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Tipo: {sectionState.section.moduleType}
                      </p>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => startEditingSection()}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <Edit className="w-6 h-6 mr-2" />
                        <span className="hidden sm:inline">Editar</span>
                      </button>
                      <button
                        onClick={() => deleteSection()}
                        className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-6 h-6 mr-2" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {sectionState.isAddingContent || sectionState.editingContent ? (
              <ContentForm />
            ) : (
              <DraggableContentList />
            )}
          </div>
        </div>
      )}

      {errors2 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
          <h3 className="font-semibold">Errores encontrados:</h3>
          <ul className="list-disc list-inside mt-2">
            {errors2.map((error, index) => (
              <li key={index} className="text-sm">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!sectionState.isAddingContent &&
        !sectionState.isEditingSection &&
        !sectionState.isEditingContent && (
          <div className="flex justify-end space-x-3 pt-8">
            <button
              onClick={onSubmit}
              className={getButtonClasses()}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </div>
              ) : message ? (
                message
              ) : (
                "Enviar datos del curso"
              )}
            </button>
          </div>
        )}
    </div>
  );
}
