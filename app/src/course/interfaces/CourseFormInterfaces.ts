// Curso ----------------------------------------------------------------------------------------------------------------------------
export interface ICourseInput {
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

export const linkTypes = ["Video", "Página", "Imagen", "Documento"] as const;
export type linkType = (typeof linkTypes)[number];

export const quizTypes = [
  "Multiple Choice",
  "true or false",
  "Short Answer",
  "Checkbox",
] as const;
export type quizType = (typeof quizTypes)[number];

export type Quiz = {
  question: string; // Pregunta
  text?: string;
  image?: string;
  type: quizType;
  answers: Array<{
    answer: string; // Respuesta
    isCorrect: boolean; // Indica si es una respuesta correcta
  }>;
};

export interface IContentInput {
  title: string;
  text: string;
  markdown?: string;
  linkType?: linkType;
  link?: string;
  quiz?: Quiz[];
  resources?: Array<{
    title: string;
    url: string;
  }>;
  duration: number;
  position: number;
}

export interface IContent {
  id: string;
  sectionId: string;
  title: string;
  text: string;
  markdown?: string;
  linkType?: linkType;
  link?: string;
  quiz?: Quiz[];
  resources?: Array<{
    title: string;
    url: string;
  }>;
  duration: number;
  position: number;
}

export interface IContentState {
  contents: IContent[];
  editingContent: IContent | null;
  isAddingContent: boolean;
  currentSectionId: string | null;
}

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
