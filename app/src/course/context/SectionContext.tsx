import React, { createContext, useContext, useEffect } from 'react';
import { ISection, ISectionInput, ISectionState } from '../interfaces/interfaces';

interface SectionContextType {
  state: ISectionState;
  addSection: () => void;
  editSection: (section: ISection) => void;
  deleteSection: (id: string) => void;
  saveSection: (sectionData: ISectionInput) => void;
  cancelEdit: () => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

const STORAGE_KEY = 'section-form-data';

const getInitialState = (): ISectionState => {
  const storedData = sessionStorage.getItem(STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (error) {
      console.error('Error parsing stored section data:', error);
    }
  }
  return {
    sections: [],
    editingSection: null,
    isAddingSection: false,
  };
};

export function SectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<ISectionState>(getInitialState);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addSection = () => {
    setState(prev => ({ ...prev, isAddingSection: true }));
  };

  const editSection = (section: ISection) => {
    setState(prev => ({ ...prev, editingSection: section }));
  };

  const deleteSection = (id: string) => {
    setState(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== id)
    }));
  };

  const saveSection = (sectionData: ISectionInput) => {
    setState(prev => {
      if (prev.editingSection) {
        const updatedSections = prev.sections.map(section =>
          section.id === prev.editingSection?.id
            ? { ...section, ...sectionData }
            : section
        );
        return {
          sections: updatedSections,
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
          sections: [...prev.sections, newSection],
          editingSection: null,
          isAddingSection: false,
        };
      }
    });
  };

  const cancelEdit = () => {
    setState(prev => ({
      ...prev,
      editingSection: null,
      isAddingSection: false,
    }));
  };

  return (
    <SectionContext.Provider
      value={{
        state,
        addSection,
        editSection,
        deleteSection,
        saveSection,
        cancelEdit,
      }}
    >
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error('useSectionContext must be used within a SectionProvider');
  }
  return context;
}