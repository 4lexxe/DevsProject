export interface CourseCreator {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
  avatar?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  userId: number;
  creator?: CourseCreator;
}
