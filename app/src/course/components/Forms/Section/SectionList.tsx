import { useState } from "react";
import { Edit, Trash2, Loader2, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ContentForm from "@/course/components/Forms/Content/ContentForm";
import { createSection } from "@/course/services/courseFormService";
import DraggableContentList from "@/course/components/Forms/Content/DraggableContentList";
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
    startEditingSection,
    deleteSection,
  } = useSectionContext();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | undefined>(undefined);
  const [message, setMessage] = useState<string>();
  const [errors2, setErrors2] = useState<string[]>();
  const navigate = useNavigate();

  const handleCreateSection = async (data: any) => {
    setIsLoading(true);
    try {
      const response = sectionId
        ? await updateSection(sectionId, data)
        : await createSection(data);
      setStatus(response.status);
      setMessage(response.message);

      if (response.statusCode === (sectionId ? 200 : 201)) {
        setTimeout(() => {
          navigate(`/course/${response.data.courseId}`);
        }, 500);
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
    const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (status) {
      case "success":
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      case "error":
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  const onSubmit = () => {
    if (!sectionState.section) return;

    const sectionData = {
      ...sectionState.section,
      contents: sectionState.section.contents.map(({ id, ...rest }) => rest),
    };

    const dataToSend = { section: sectionData, courseId };
    handleCreateSection(dataToSend);
  };

  if (!sectionState.section) {
    return (
      <div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Sin secciones añadidas</h3>
          <p className="mt-1 text-sm text-gray-500">Comience añadiendo una nueva sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {sectionState.section.coverImage && (
              <div className="lg:w-1/4 flex-shrink-0">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <img
                    src={sectionState.section.coverImage}
                    alt={sectionState.section.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    {sectionState.section.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{sectionState.section.moduleType}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => startEditingSection()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => deleteSection()}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm line-clamp-3">
                {sectionState.section.description}
              </p>
            </div>
          </div>
        </div>

        {sectionState.isAddingContent || sectionState.editingContent ? (
          <div className="border-t border-gray-200">
            <ContentForm />
          </div>
        ) : (
          <div className="border-t border-gray-200">
            <DraggableContentList />
          </div>
        )}
      </div>

      {errors2 && errors2.length > 0 && (
        <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Se encontraron los siguientes errores:
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {errors2.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {!sectionState.isAddingContent && !sectionState.isEditingSection && !sectionState.isEditingContent && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className={getButtonClasses()}
          >
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                <span>Procesando...</span>
              </div>
            ) : (
              <span>{message || "Guardar cambios"}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}