import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ISection,
  ISectionInput,
  IContent,
  IContentInput,
  ICourseState,
} from "../interfaces/CourseFormInterfaces";

interface CourseContextType {
  state: ICourseState;
  addSection: () => void;
  editSection: (section: ISection) => void;
  deleteSection: (id: string) => void;
  saveSection: (sectionData: ISectionInput) => void;
  addContent: (sectionId: string) => void;
  editContent: (sectionId: string, content: IContent) => void;
  deleteContent: (sectionId: string, contentId: string) => void;
  saveContent: (sectionId: string, contentData: IContentInput) => void;
  cancelEdit: () => void;
  updateContentPosition: (
    sectionId: string,
    contentId: string,
    newPosition: number
  ) => void;
  addQuizToContent: (sectionId: string, contentId: string, quiz: any[]) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);
const STORAGE_KEY = "course-form-data";

const getInitialState = (): ICourseState => {
  const storedData = sessionStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error("Error parsing stored course data:", error);
    }
  }
  return {
    sections: [],
    editingSection: null,
    isAddingSection: false,
    editingContent: null,
    isAddingContent: false,
    currentSectionId: null,
  };
};

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ICourseState>(getInitialState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /*** 🔹 MÉTODOS PARA SECCIONES ***/
  const addSection = () =>
    setState((prev) => ({ ...prev, isAddingSection: true }));

  const editSection = (section: ISection) =>
    setState((prev) => ({ ...prev, editingSection: section }));

  const deleteSection = (id: string) =>
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
    }));

  const saveSection = (sectionData: ISectionInput) => {
    setState((prev) => {
      if (prev.editingSection) {
        return {
          ...prev,
          sections: prev.sections.map((section) =>
            section.id === prev.editingSection?.id
              ? { ...section, ...sectionData }
              : section
          ),
          editingSection: null,
          isAddingSection: false,
        };
      } else {
        const newSection = {
          ...sectionData,
          id: crypto.randomUUID(),
          contents: [],
        };
        return {
          ...prev,
          sections: [...prev.sections, newSection],
          isAddingSection: false,
        };
      }
    });
  };

  /*** 🔹 MÉTODOS PARA CONTENIDOS ***/
  const addContent = (sectionId: string) => {
    setState((prev) => ({
      ...prev,
      isAddingContent: true,
      currentSectionId: sectionId,
    }));
  };

  const editContent = (sectionId: string, content: IContent) =>
    setState((prev) => ({
      ...prev,
      editingContent: content,
      currentSectionId: sectionId, // ✅ Se guarda la sección a la que pertenece el contenido
    }));

  const deleteContent = (sectionId: string, contentId: string) => {
    setState((prev) => {
      const updatedSections = prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              contents: section.contents
                .filter((content) => content.id !== contentId)
                .map((content, index) => ({ ...content, position: index })), // ✅ Reajusta posiciones después de eliminar
            }
          : section
      );

      return { ...prev, sections: updatedSections };
    });
  };

  const saveContent = (sectionId: string, contentData: IContentInput): void => {
    setState((prev) => {
      // 🔹 Buscar la sección donde se debe guardar el contenido
      const sectionIndex = prev.sections.findIndex(
        (section) => section.id === sectionId
      );
  
      if (sectionIndex === -1) {
        console.error(`Sección con ID ${sectionId} no encontrada.`);
        return prev; // 🚨 Evita romper el estado si la sección no existe
      }
  
      const updatedSections = [...prev.sections]; // Clonamos el array de secciones
      const sectionContents = updatedSections[sectionIndex].contents;
  
      if (prev.editingContent) {
        // ✅ Editar contenido existente
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          contents: sectionContents.map((content) =>
            content.id === prev.editingContent?.id
              ? { ...content, ...contentData }
              : content
          ),
        };
      } else {
        // ✅ Agregar nuevo contenido al final con `position` correcto
        const lastPosition = sectionContents.length > 0 
          ? Math.max(...sectionContents.map((c) => c.position)) 
          : 0; // Si no hay contenidos, empieza en 1
  
        const newContent: IContent = {
          id: crypto.randomUUID(),
          sectionId: sectionId,
          ...contentData, // Ahora `contentData` no sobrescribe `position`
          position: lastPosition + 1, // 🔥 Asignamos `position` antes del spread
        };
  
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          contents: [...sectionContents, newContent], // Se añade al final
        };
      }
  
      return {
        ...prev,
        sections: updatedSections,
        editingContent: null,
        isAddingContent: false,
        currentSectionId: null,
      };
    });
  };

  const updateContentPosition = (
    sectionId: string,
    contentId: string,
    newPosition: number
  ) => {
    setState((prev) => {
      return {
        ...prev,
        sections: prev.sections.map((section) => {
          if (section.id === sectionId) {
            let updatedContents = section.contents.map((content) =>
              content.id === contentId
                ? { ...content, position: newPosition }
                : content
            );

            // 🔥 Siempre ordenamos los contenidos por `position`
            updatedContents = updatedContents.sort(
              (a, b) => a.position - b.position
            );

            return { ...section, contents: updatedContents };
          }
          return section;
        }),
      };
    });
  };

  const addQuizToContent = (sectionId: string, contentId: string, quiz: any[]) => {
    setState((prev) => {
      const updatedSections = prev.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            contents: section.contents.map((content) =>
              content.id === contentId ? { ...content, quiz } : content
            ),
          };
        }
        return section;
      });
  
      return { ...prev, sections: updatedSections };
    });
  };

  const cancelEdit = () =>
    setState((prev) => ({
      ...prev,
      editingSection: null,
      isAddingSection: false,
      editingContent: null,
      isAddingContent: false,
      currentSectionId: null,
    }));

  return (
    <CourseContext.Provider
      value={{
        state,
        addSection,
        editSection,
        deleteSection,
        saveSection,
        addContent,
        editContent,
        deleteContent,
        saveContent,
        cancelEdit,
        updateContentPosition,
        addQuizToContent
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
}
