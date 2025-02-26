import { IContent, IContentInput } from "./Content";

// Curso ----------------------------------------------------------------------------------------------------------------------------
export interface ICourseInput {
  id?: string;
  title: string;
  image: string;
  summary: string;
  categoryIds: string[];
  about: string;
  careerTypeId?: string;
  learningOutcomes: string[] | "";
  prerequisites?: string[] | "";
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: string;
}

export interface ICourse {
  id: string;
  title: string;
  image: string;
  summary: string;
  categoryIds: string[];
  about: string;
  careerTypeId?: string;
  learningOutcomes: string[] | "";
  prerequisites?: string[] | "";
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: string;
}

// Seccion ----------------------------------------------------------------------------------------------------------------------------

export interface ISectionInput {
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  colorGradient: [string, string];
}
export interface ISection {
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  contents: IContent[];
  colorGradient: [string, string];
}

export interface ISectionState {
  section: ISection | null;
  isAddingSection: boolean; // 🔹 Nueva propiedad: indica si se está agregando una nueva sección
  isEditingSection: boolean; // 🔹 Indica si la sección está en edición
  editingContent: IContent | null;
  isAddingContent: boolean;
  isEditingContent: boolean; // 🔹 Indica si un contenido está en edición
}


// Contenido ----------------------------------------------------------------------------------------------------------------------------

export interface SectionListProps {
  sections: ISectionInput[];
  contents: IContentInput[];
  onAddSection: () => void;
  onEditSection: (section: ISectionInput) => void;
  onDeleteSection: (id: string) => void;
  onAddContent: (sectionId: string) => void;
  onEditContent: (content: IContentInput) => void;
  onDeleteContent: (id: string) => void;
}
