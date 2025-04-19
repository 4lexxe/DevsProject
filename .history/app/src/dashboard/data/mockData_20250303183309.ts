import { User, Course, Notification, Assignment, CalendarEvent, Student, Revenue, SystemStats } from '../types';

export const currentUser: User = {
  id: '1',
  name: 'Admin User',
  email: 'admin@edulearn.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'admin'
};

export const courses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    instructor: 'Sarah Miller',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    enrolledStudents: 245,
    totalLessons: 12,
    category: 'Web Development',
    duration: '8 weeks',
    level: 'beginner',
    status: 'active',
    rating: 4.7,
    revenue: 12250
  },
  {
    id: '2',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts and patterns',
    instructor: 'David Chen',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    enrolledStudents: 189,
    totalLessons: 10,
    category: 'Frontend',
    duration: '6 weeks',
    level: 'advanced',
    status: 'active',
    rating: 4.9,
    revenue: 18900
  },
  {
    id: '3',
    title: 'Data Structures and Algorithms',
    description: 'Comprehensive guide to data structures and algorithms',
    instructor: 'Michael Brown',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    enrolledStudents: 312,
    totalLessons: 15,
    category: 'Computer Science',
    duration: '10 weeks',
    level: 'intermediate',
    status: 'active',
    rating: 4.5,
    revenue: 31200
  },
  {
    id: '4',
    title: 'UX/UI Design Fundamentals',
    description: 'Learn the principles of user experience and interface design',
    instructor: 'Emily Wilson',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    enrolledStudents: 178,
    totalLessons: 8,
    category: 'Design',
    duration: '5 weeks',
    level: 'beginner',
    status: 'draft',
    rating: 0,
    revenue: 0
  }
];

export const notifications: Notification[] = [
  {
    id: '1',
    message: 'New instructor application from John Smith',
    date: '2025-04-15T10:30:00',
    read: false,
    type: 'info'
  },
  {
    id: '2',
    message: 'Course "Advanced React Patterns" needs review',
    date: '2025-04-14T15:45:00',
    read: true,
    type: 'warning'
  },
  {
    id: '3',
    message: 'Monthly revenue report is ready',
    date: '2025-04-13T09:15:00',
    read: false,
    type: 'success'
  }
];

export const assignments: Assignment[] = [
  {
    id: '1',
    title: 'Build a Responsive Website',
    courseId: '1',
    courseName: 'Introduction to Web Development',
    dueDate: '2025-04-20T23:59:59',
    submissionsCount: 180,
    gradedCount: 120
  },
  {
    id: '2',
    title: 'Implement Custom Hooks',
    courseId: '2',
    courseName: 'Advanced React Patterns',
    dueDate: '2025-04-25T23:59:59',
    submissionsCount: 145,
    gradedCount: 90
  },
  {
    id: '3',
    title: 'Sorting Algorithms Implementation',
    courseId: '3',
    courseName: 'Data Structures and Algorithms',
    dueDate: '2025-04-18T23:59:59',
    submissionsCount: 250,
    gradedCount: 230
  }
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'New Course Review Meeting',
    date: '2025-04-16T14:00:00',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Instructor Training Session',
    date: '2025-04-25T23:59:59',
    type: 'class'
  },
  {
    id: '3',
    title: 'Platform Maintenance',
    date: '2025-04-19T10:00:00',
    type: 'meeting'
  }
];

export const students: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    enrolledCourses: 3,
    lastActive: '2025-04-15T10:30:00',
    progress: 68,
    status: 'active'
  },
  {
    id: '2',
    name: 'Emma Williams',
    email: 'emma.williams@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    enrolledCourses: 2,
    lastActive: '2025-04-14T15:45:00',
    progress: 42,
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    enrolledCourses: 1,
    lastActive: '2025-04-10T09:15:00',
    progress: 15,
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    enrolledCourses: 4,
    lastActive: '2025-04-15T08:20:00',
    progress: 89,
    status: 'active'
  }
];

export const revenueData: Revenue[] = [
  { month: 'Jan', amount: 25000 },
  { month: 'Feb', amount: 30000 },
  { month: 'Mar', amount: 35000 },
  { month: 'Apr', amount: 40000 },
  { month: 'May', amount: 38000 },
  { month: 'Jun', amount: 42000 },
  { month: 'Jul', amount: 45000 },
  { month: 'Aug', amount: 48000 },
  { month: 'Sep', amount: 50000 },
  { month: 'Oct', amount: 52000 },
  { month: 'Nov', amount: 55000 },
  { month: 'Dec', amount: 60000 }
];

export const systemStats: SystemStats = {
  totalStudents: 2450,
  totalCourses: 78,
  totalInstructors: 32,
  totalRevenue: 480000,
  activeUsers: 1850,
  newUsersToday: 24,
  coursesCreatedThisMonth: 5,
  completionRate: 72
};