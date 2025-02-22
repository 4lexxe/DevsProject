import { IContent } from "./Content";

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
}

export interface Section {
  id: number;
  title: string;
  description: string;
  moduleType: string;
  coverImage: string;
  lessonsCount: number;
  duration: number;

  contents: IContent[];
}

