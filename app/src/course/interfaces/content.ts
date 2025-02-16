
export interface IContent {
  id: string;
  sectionId: string;
  type: string;
  contentText?: string;
  contentTextTitle?: string;
  contentVideo?: string;
  contentVideoTitle?: string;
  contentImage?: string;
  contentImageTitle?: string;
  contentFile?: string;
  contentFileTitle?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  quizTitle?: string;
  quizContent?: string;
  questions?: string[] | string;
  duration?: number;
  position: number;
}

export interface IContentInput {
  type: string;
  contentText?: string;
  contentTextTitle?: string;
  contentVideo?: string;
  contentVideoTitle?: string;
  contentImage?: string;
  contentImageTitle?: string;
  contentFile?: string;
  contentFileTitle?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  quizTitle?: string;
  quizContent?: string;
  questions?: string[] | string;
  duration?: number;
  position: number | 0;
}

export interface IContentState {
  contents: IContent[];
  editingContent: IContent | null;
  isAddingContent: boolean;
  currentSectionId: string | null;
}

/* Interfaces de cada tipo de contenido */

interface ICommon {
  content: string;
  title: string;
  duration: number;
  position: number | 0;
}

export interface IFileContentInput extends ICommon {
  
}

export interface IImageContentInput extends ICommon {
  
}

export interface ILinkContentInput  extends ICommon{
}

export const quizType = [
  'Multiple Choice', 
  'true or false', 
  'Short Answer', 
  'Checkbox', 
] as const;

export type quizType = (typeof quizType)[number];

export interface IQuizContentInput extends ICommon {

  questions?: Array<{
    question: string; // Pregunta
    text?: string;
    image?: string;
    type: quizType;
    answers: Array<{
      answer: string; // Respuesta
      isCorrect: boolean; // Indica si es una respuesta correcta
    }>;
  }>;
}

export interface ITextContentInput extends ICommon {
}

export interface IVideoContentInput  extends ICommon{
}
