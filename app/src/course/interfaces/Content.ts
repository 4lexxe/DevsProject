export const quizTypes = [
  "Single",
  "MultipleChoice",
  "TrueOrFalse",
  "ShortAnswer",
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

export type Resource = {
  title: string;
  url: string;
}

export interface IContentInput {
  title: string;
  text: string;
  markdown?: string;
  quiz?: Quiz[];
  resources?: Resource[];
  duration: number;
  position: number;
}

export interface IContent {
  id: string;
  title: string;
  text: string;
  markdown?: string;
  quiz?: Quiz[];
  resources?: Resource[];
  duration: number;
  position: number;
}

export interface IContentState {
  contents: IContent[];
  editingContent: IContent | null;
  isAddingContent: boolean;
  currentSectionId: string | null;
}

export interface IContentFile {
  id: string;
  contentId: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: string;
  mimeType: string;
  driveFileId: string;
  driveUrl: string;
  thumbnailLink?: string;
  driveWebViewLink: string;
  driveWebContentLink?: string;
  drivePreviewLink?: string;
  description?: string;
  isPublic: boolean;
  allowDownload: boolean;
  uploadedBy: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IContentApi {
  id: string;
  sectionId: string;
  title: string;
  text: string;
  markdown?: string;
  quiz?: Quiz[];
  resources?: Resource[];
  duration: number;
  position: number;
  section: any;
  files?: IContentFile[];
  createdAt: Date;
  updatedAt: Date;
}
