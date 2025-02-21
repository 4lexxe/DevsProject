export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CareerType {
  id: number;
  name: string;
}

export interface Section {
  id: number;
  title: string;
  courseId: number;
}

export interface Course {
  id: number;
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId: number;
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number;
  categories?: Category[];
  careerType?: CareerType;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseResponse {
  status: number;
  url: string;
  message: string;
  length?: number;
  data: Course | Course[];
  total?: number;
}

export interface CreateCourseData {
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId: number;
  learningOutcomes: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: number;
  categoryIds?: number[];
}

export interface UpdateCourseData {
  title?: string;
  image?: string;
  summary?: string;
  about?: string;
  careerTypeId?: number;
  learningOutcomes?: string[];
  isActive?: boolean;
  isInDevelopment?: boolean;
  adminId?: number;
  categoryIds?: number[];
}