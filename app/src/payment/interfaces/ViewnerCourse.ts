import { IContentApi } from "./Content";

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
  prerequisites: string[];
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number; 
  createdAt: string;
  price?: number;
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    activeDiscount?: {
      id: number;
      event: string;
      description: string;
      percentage: number;
      amount: number;
      startDate: string;
      endDate: string;
    };
    savings: number;
  };
}

export interface Section {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  lessonsCount: number;
  duration: number;
  course: Course,
  colorGradient: [string, string];
  contents: IContentApi[];
  courseId: string;
}

// Interfaz específica para cursos que el usuario ya posee
export interface MyCourseDetail {
  id: number;
  title: string;
  image: string;
  summary: string;
  categories: Category[];
  about: string;
  careerType: CareerType;
  prerequisites: string[];
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number; 
  createdAt: string;
  sections: Section[];
  // Información específica de acceso del usuario
  accessGrantedAt?: string;
  progress?: number;
  status?: 'active' | 'revoked';
  // Información de precios (opcional para cursos ya adquiridos)
  pricing?: {
    originalPrice: number;
    finalPrice: number;
    hasDiscount: boolean;
    activeDiscount?: {
      id: number;
      event: string;
      description: string;
      percentage: number;
      amount: number;
      startDate: string;
      endDate: string;
    };
    savings: number;
  };
}

