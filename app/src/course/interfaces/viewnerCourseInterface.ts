export interface Category{
  id: string;
  name: string;
  image?: string;
  description: string;
  isActive: boolean;
}

export type CareerType = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Course {
  id: number;
  title: string;
  image: string;
  summary: string;
  categories: Category[];
  about: string;
  careerType: CareerType;
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number; 
  createdAt: string;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  lessonsCount: number;
  duration: number;

  contents: Content[];
}

type quizType = "Multiple Choice"
  | "true or false"
  | "Short Answer"
  | "Checkbox";

type linkType = "video" | "pagina" | "imagen" | "documento"

export interface Content {
   id: bigint;
   sectionId: bigint;
   title: string;
   text: string;
   markdown?: string;
   linkType?: string;
   link?: string;
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
   resources?: Array<{
    title: string;
    url: string;
  }>;
   duration: number;
   position: number;
    createdAt: Date;
    updatedAt: Date;
}