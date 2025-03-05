export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  enrolledStudents: number;
  totalLessons: number;
  category: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'draft' | 'archived';
  rating: number;
  revenue: number;
}

export interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueDate: string;
  submissionsCount: number;
  gradedCount: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'class' | 'assignment' | 'exam' | 'meeting';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  enrolledCourses: number;
  lastActive: string;
  progress: number;
  status: 'active' | 'inactive';
}

export interface Revenue {
  month: string;
  amount: number;
}

export interface SystemStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  totalRevenue: number;
  activeUsers: number;
  newUsersToday: number;
  coursesCreatedThisMonth: number;
  completionRate: number;
}