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

export interface DiscountEvent {
  id: string;
  event: string;
  description: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  CourseDiscountEventAssociation: {
    courseId: string;
    discountEventId: string;
  };
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
    discountEvents: DiscountEvent[];
    totalDiscountPercentage: number;
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

