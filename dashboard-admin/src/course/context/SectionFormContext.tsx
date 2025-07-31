import React, { createContext, useContext, useState, useCallback } from "react";
import {
  ISection,
  ISectionInput,
  ISectionState,
} from "../interfaces/CourseForm";
import { IContent, IContentInput } from "../interfaces/Content";

interface SectionContextType {
  state: ISectionState;
  setSection: (section: ISection) => void;
  editSection: (sectionData: ISectionInput) => void;
  startAddingSection: () => void;
  startEditingSection: () => void;
  deleteSection: () => void;
  addContent: () => void;
  editContent: (content: IContent) => void;
  deleteContent: (contentId: string) => void;
  saveContent: (contentData: IContentInput) => void;
  cancelEdit: () => void;
  updateContentPosition: (contentId: string, newPosition: number) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ISectionState>({
    section: null,
    editingContent: null,
    isAddingContent: false,
    isAddingSection: false,
    isEditingSection: false,
    isEditingContent: false,
  });

  /*** 🔹 MÉTODOS PARA SECCIÓN ***/
  const setSection = useCallback((section: ISection) => {
    setState((prev) => ({ ...prev, section, isEditingSection: false }));
  }, []);

  const editSection = useCallback((sectionData: ISectionInput) => {
    setState((prev) => {
      if (!prev.section) return prev;
      return {
        ...prev,
        section: { ...prev.section, ...sectionData },
        isEditingSection: false,
      };
    });
  }, []);

  const startAddingSection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAddingSection: true,
      isEditingSection: false,
      section: null,
    }));
  }, []);

  const startEditingSection = useCallback(() => {
    setState((prev) => ({ ...prev, isEditingSection: true }));
  }, []);

  const deleteSection = useCallback(() => {
    setState((prev) => ({ ...prev, section: null, isEditingSection: false }));
  }, []);

  /*** 🔹 MÉTODOS PARA CONTENIDO ***/
  const addContent = useCallback(() => {
    setState((prev) => ({ ...prev, isAddingContent: true, isEditingContent: false }));
  }, []);

  const editContent = useCallback((content: IContent) => {
    setState((prev) => ({
      ...prev,
      editingContent: content,
      isEditingContent: true,
    }));
  }, []);

  const deleteContent = useCallback((contentId: string) => {
    setState((prev) => {
      if (!prev.section) return prev;
      return {
        ...prev,
        section: {
          ...prev.section,
          contents: prev.section.contents
            .filter((content) => content.id !== contentId)
            .map((content, index) => ({ ...content, position: index })),
        },
      };
    });
  }, []);

  const saveContent = useCallback((contentData: IContentInput): void => {
    setState((prev) => {
      if (!prev.section) return prev;
      const section = prev.section!;
      const { editingContent } = prev;
      if (editingContent) {
        return {
          ...prev,
          section: {
            ...section,
            contents: section.contents.map((content) =>
              content.id === editingContent.id
                ? { ...content, ...contentData }
                : content
            ),
          },
          editingContent: null,
          isAddingContent: false,
          isEditingContent: false,
        };
      } else {
        const lastPosition = section.contents.length
          ? Math.max(...section.contents.map((c) => c.position))
          : 0;
        const newContent: IContent = {
          id: crypto.randomUUID(),
          ...contentData,
          position: lastPosition + 1,
        };
        return {
          ...prev,
          section: {
            ...section,
            contents: [...section.contents, newContent],
          },
          isAddingContent: false,
          isEditingContent: false,
        };
      }
    });
  }, []);

  const updateContentPosition = useCallback((contentId: string, newPosition: number) => {
    setState((prev) => {
      if (!prev.section) return prev;
      return {
        ...prev,
        section: {
          ...prev.section,
          contents: prev.section.contents
            .map((content) =>
              content.id === contentId
                ? { ...content, position: newPosition }
                : content
            )
            .sort((a, b) => a.position - b.position),
        },
      };
    });
  }, []);

  const cancelEdit = useCallback(() => {
    setState((prev) => ({
      ...prev,
      editingContent: null,
      isAddingContent: false,
      isEditingContent: false,
      isAddingSection: false,
      isEditingSection: false,
    }));
  }, []);

  return (
    <SectionContext.Provider
      value={{
        state,
        setSection,
        editSection,
        startAddingSection,
        startEditingSection,
        deleteSection,
        addContent,
        editContent,
        deleteContent,
        saveContent,
        cancelEdit,
        updateContentPosition,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSectionContext must be used within a SectionProvider");
  }
  return context;
}