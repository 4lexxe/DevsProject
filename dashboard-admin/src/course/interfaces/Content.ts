import { z } from "zod";
import { contentSchema } from "../validations/contentSchema";

export const quizTypes = [
  "Single",
  "MultipleChoice", 
  "TrueOrFalse",
  "ShortAnswer",
] as const;
export type quizType = (typeof quizTypes)[number];

export type Quiz = {
  id: string;
  question: string; // Pregunta
  description: string;
  order: number;
  points: number; // Puntos que vale la pregunta
  markdown?: string; // Contenido markdown opcional
  explanation?: string;
  image?: string;
  type: quizType;
  answers: Array<{
    id?: string;
    text: string; // Respuesta
    isCorrect: boolean; // Indica si es una respuesta correcta
    explanation?: string;
  }>;
  metadata?: {
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
  };
};

export type Resource = {
  title: string;
  url: string;
}

// Interfaz inferida del esquema de validación para garantizar consistencia
export type IContentFormData = z.infer<typeof contentSchema>;

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
  createdAt: Date;
  updatedAt: Date;
}
