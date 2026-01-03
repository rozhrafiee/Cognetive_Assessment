
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
  level: number;
  scoreHistory: ScoreRecord[];
  xp: number; // Experience points for gamification
}

export interface ScoreRecord {
  contentId: string;
  score: number;
  date: string;
}

export enum ContentType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  SCENARIO = 'SCENARIO' // New Interactive Scenario type
}

export interface ScenarioStep {
  id: string;
  text: string;
  options: {
    text: string;
    nextStepId?: string;
    impact: number; // positive or negative cognitive impact
    feedback: string;
  }[];
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
  scenarioSteps?: ScenarioStep[]; // For interactive scenarios
}

export enum QuestionType {
  MCQ = 'MCQ',
  DESCRIPTIVE = 'DESCRIPTIVE'
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctOption?: number;
}

export interface Exam {
  id: string;
  contentId: string;
  title: string;
  questions: Question[];
  isActive: boolean;
  timeLimit: number;
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

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}
