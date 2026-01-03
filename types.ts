
export enum UserRole {
  CITIZEN = 'CITIZEN',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: number; // 0 means placement test required
  scoreHistory: ScoreRecord[];
}

export interface ScoreRecord {
  contentId: string;
  score: number;
  date: string;
}

export enum ContentType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO'
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  minLevel: number;
  maxLevel: number;
  durationMinutes: number;
  authorId: string;
  isActive: boolean;
  body?: string;
  videoUrl?: string;
}

export enum QuestionType {
  MCQ = 'MCQ', // Multiple Choice
  DESCRIPTIVE = 'DESCRIPTIVE'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Only for MCQ
  correctOption?: number; // Index
}

export interface Exam {
  id: string;
  contentId: string; // "placement" for placement test
  title: string;
  questions: Question[];
  isActive: boolean;
  timeLimit: number; // minutes
}

export interface Attempt {
  id: string;
  userId: string;
  examId: string;
  answers: Record<string, string | number>;
  score?: number;
  isGraded: boolean;
  date: string;
}
