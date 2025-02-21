import React from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

import ContentForm from "@/course/components/forms/content/ContentForm";
import { createSections } from "@/course/services/courseFormService";

import DraggableContentList from "@/course/components/forms/content/DraggableContentList";
import { useCourseContext } from "@/course/context/CourseFormContext";

export default function SectionList() {
  const {
    state: sectionState,
    addSection,
    editSection,
    deleteSection,
  } = useCourseContext();

  const handleCreateSections = async(data: any) => {
    try {
          const newCourse = await createSections(data);
          console.log("Secciones con sus contenidos insertadas", newCourse);
          // Aquí podrías redirigir a otra página o limpiar el formulario
        } catch (err) {
          console.log("Error al crear el curso. Inténtalo nuevamente.", err);
        }
  }

  const courseId = 3;

  const onSubmit = () => {
    let data = sectionState.sections;
    let data2 = data.map((section: any) => {
      let {id, ...resto} = section;
      
      resto.contents = resto.contents.map((content: any) => {
        const {id, sectionId,  ...resto2} = content;
        return resto2;
      } )

      return resto;
    })

    /* data2 = {...data2, courseId: courseId}; */
    let data3 = {sections: data2, courseId: courseId}

    handleCreateSections(data3);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Secciones</h1>
        <button
          onClick={addSection}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir sección
        </button>
      </div>

      {sectionState.sections.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Sin secciones añadidas</p>
      ) : (
        <div className="grid gap-6">
          {sectionState.sections.map((section: any) => (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  {section.coverImage && (
                    <img
                      src={section.coverImage || "/placeholder.svg"}
                      alt={section.title}
                      className="w-full sm:w-48 h-48 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {section.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Tipo: {section.moduleType}
                        </p>
                      </div>
                      <div className="flex space-x-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => editSection(section)}
                          className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-blue-600"
                        >
                          <Edit className="w-6 h-6 mr-2" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-6 h-6 mr-2" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {sectionState.isAddingContent || sectionState.editingContent ? (
                <ContentForm sectionId={section.id} />
              ) : (
                <DraggableContentList sectionId={section.id} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end ">
        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        >
          Enviar
        </button>

      </div>
    </div>
  );
}
