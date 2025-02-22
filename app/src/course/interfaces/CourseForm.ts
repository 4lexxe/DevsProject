import { IContent, IContentInput} from './Content'

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
  careerTypeId?: string
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
}
export interface ISection {
  id: string;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  contents: IContent[];
}

export interface ISectionState {
  sections: ISection[];
  editingSection: ISection | null;
  isAddingSection: boolean;
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
