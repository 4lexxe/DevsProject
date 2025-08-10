export interface Category {
  id: string;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  CourseCategory: {
    courseId: string;
    categoryId: string;
  };
}

export interface CareerType {
  id: string;
  name: string;
  icon?: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  deletedAt?: string;
  CourseDiscountEventAssociation?: {
    courseId: string;
    discountEventId: string;
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  courseId: string;
  coverImage?: string;
  moduleType: string;
  colorGradient: [string, string];
  createdAt: string;
  updatedAt: string;
}

export interface Discount {
    id: number;
    event: string;
    description: string;
    value: number;
    startDate: string;
    endDate: string;
}

export interface PricingInfo {
  originalPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  discount?: Discount | null;
  discountValue: number;
  savings: number;
  isFree: boolean;
  priceDisplay: string;
}


export interface CourseData {
  id: string;
  title: string;
  image: string;
  summary: string;
  about: string;
  careerTypeId: string;
  learningOutcomes: string[];
  prerequisites?: string[];
  isActive: boolean;
  isInDevelopment: boolean;
  adminId: string;
  price?: string;
  createdAt: string;
  updatedAt: string;
  categories: Category[];
  careerType: CareerType;
  sections?: Section[];
  discountEvents?: DiscountEvent[];
  pricing?: PricingInfo;
}