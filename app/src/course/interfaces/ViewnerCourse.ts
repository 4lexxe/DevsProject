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
  slug?: string; // Slug para URLs SEO-friendly
  title: string;
  image: string;
  summary: string;
  categories: Category[];
  about: string;
  careerType?: CareerType | null;
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
    discount?: {
      id: number;
      event: string;
      description: string;
      value: number;
      startDate: string;
      endDate: string;
    } | null;
    discountValue: number;
    savings: number;
    isFree: boolean;
    priceDisplay: string;
  };
  // Campos del header dinámico
  headerType?: 'default' | 'programming' | 'hacking' | 'custom' | 'iframe';
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerButtonText?: string;
  headerButtonLink?: string;
  techStack?: string[];
  customHeaderContent?: string;
  affiliatedCourse?: Course | null;
  affiliatedCourseId?: number | null;
  creator?: {
    id: number;
    name: string;
    username?: string;
    avatar?: string;
  } | null;
}

export interface Section {
  id: number;
  slug?: string; // Slug para URLs SEO-friendly
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

