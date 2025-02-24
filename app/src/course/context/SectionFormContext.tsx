import React, { createContext, useContext, useState } from "react";
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
  startEditingSection: () => void;
  deleteSection: () => void;
  addContent: () => void;
  editContent: (content: IContent) => void;
  deleteContent: (contentId: string) => void;
  saveContent: (contentData: IContentInput) => void;
  cancelEdit: () => void;
  updateContentPosition: (contentId: string, newPosition: number) => void;
  addQuizToContent: (contentId: string, quiz: any[]) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ISectionState>({
    section: null,
    editingContent: null,
    isAddingContent: false,
    isEditingSection: false,
    isEditingContent: false,
  });

  /*** 🔹 MÉTODOS PARA SECCIÓN ***/
  const setSection = (section: ISection) =>
    setState({ ...state, section, isEditingSection: false });

  const editSection = (sectionData: ISectionInput) => {
    if (!state.section) return;
    setState({
      ...state,
      section: { ...state.section, ...sectionData },
      isEditingSection: false,
    });
  };

  const startEditingSection = () =>
    setState((prev) => ({ ...prev, isEditingSection: true }));

  const deleteSection = () =>
    setState({ ...state, section: null, isEditingSection: false });

  /*** 🔹 MÉTODOS PARA CONTENIDO ***/
  const addContent = () =>
    setState({ ...state, isAddingContent: true, isEditingContent: false });

  const editContent = (content: IContent) =>
    setState({
      ...state,
      editingContent: content,
      isEditingContent: true,
    });

  const deleteContent = (contentId: string) => {
    if (!state.section) return;

    setState({
      ...state,
      section: {
        ...state.section,
        contents: state.section.contents
          .filter((content) => content.id !== contentId)
          .map((content, index) => ({ ...content, position: index })),
      },
    });
  };

  const saveContent = (contentData: IContentInput): void => {
    if (!state.section) return;

    setState((prev) => {
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
  };

  const updateContentPosition = (contentId: string, newPosition: number) => {
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
  };

  const addQuizToContent = (contentId: string, quiz: any[]) => {
    if (!state.section) return;

    setState({
      ...state,
      section: {
        ...state.section,
        contents: state.section.contents.map((content) =>
          content.id === contentId ? { ...content, quiz } : content
        ),
      },
    });
  };

  const cancelEdit = () =>
    setState({
      ...state,
      editingContent: null,
      isAddingContent: false,
      isEditingContent: false,
      isEditingSection: false,
    });

  return (
    <SectionContext.Provider
      value={{
        state,
        setSection,
        editSection,
        startEditingSection,
        deleteSection,
        addContent,
        editContent,
        deleteContent,
        saveContent,
        cancelEdit,
        updateContentPosition,
        addQuizToContent,
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
