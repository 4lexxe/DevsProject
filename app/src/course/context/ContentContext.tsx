import React, { createContext, useContext, useEffect } from 'react';
import { IContent, IContentInput, IContentState } from '../interfaces/interfaces';

interface ContentContextType {
  state: IContentState;
  addContent: (sectionId: string) => void;
  editContent: (content: IContent) => void;
  deleteContent: (id: string) => void;
  saveContent: (contentData: IContentInput) => void;
  cancelEdit: () => void;
  updateContentPosition: (sectionId: string, newPosition: number) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const STORAGE_KEY = 'content-form-data';

const getInitialState = (): IContentState => {
  const storedData = sessionStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing stored content data:', error);
    }
  }
  return {
    contents: [],
    editingContent: null,
    isAddingContent: false,
    currentSectionId: null,
  };
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<IContentState>(getInitialState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addContent = (sectionId: string) => {
    setState(prev => ({
      ...prev,
      isAddingContent: true,
      currentSectionId: sectionId,
    }));
  };

  const editContent = (content: IContent) => {
    setState(prev => ({
      ...prev,
      editingContent: content,
      currentSectionId: content.sectionId,
    }));
  };

  const deleteContent = (id: string) => {
    setState(prev => ({
      ...prev,
      contents: prev.contents.filter(content => content.id !== id)
    }));
  };

  const saveContent = (contentData: IContentInput): void => {
    setState((prev: any): IContentState => {
      if (prev.editingContent) {
        const updatedContents = prev.contents.map((content: IContent) =>
          content.id === prev.editingContent?.id
            ? { ...content, ...contentData }
            : content
        );
        return {
          ...prev,
          contents: updatedContents,
          editingContent: null,
          isAddingContent: false,
          currentSectionId: null,
        };
      } else if (prev.currentSectionId) {
        const newContent = {
          ...contentData,
          id: crypto.randomUUID() as string,
          sectionId: prev.currentSectionId,
        };
        return {
          ...prev,
          contents: [...prev.contents, newContent],
          editingContent: null,
          isAddingContent: false,
          currentSectionId: null,
        };
      }
      return prev;
    });
  };

  const cancelEdit = () => {
    setState(prev => ({
      ...prev,
      editingContent: null,
      isAddingContent: false,
      currentSectionId: null,
    }));
  };

  const updateContentPosition = (contentId: string, newPosition: number) => {
    setState(prev => ({
      ...prev,
      contents: prev.contents.map(content =>
          content.id === contentId
              ? { ...content, position: newPosition }
              : content
      ),
    }));
  };

  return (
    <ContentContext.Provider
      value={{
        state,
        addContent,
        editContent,
        deleteContent,
        saveContent,
        cancelEdit,
        updateContentPosition,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContentContext must be used within a ContentProvider');
  }
  return context;
}