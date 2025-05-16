export interface Session {
  id: string;
  date: string;
  location: string;
  duration: number;
  waveHeight: number;
  windSpeed: number;
  temperature: number;
  notes?: string;
  rating: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  totalSkills: number;
  completedSkills: number;
  icon: string;
  color: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  categories: string[];
  instructor: string;
  videoUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
  bio: string;
  level: string;
  levelProgress: number;
  totalSessions: number;
  totalHours: number;
  skillsMastered: number;
  totalSkills: number;
}