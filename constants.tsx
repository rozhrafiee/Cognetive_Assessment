
import { Content, ContentType, Exam, QuestionType, User, UserRole } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'علی محمدی',
  email: 'ali@example.com',
  role: UserRole.CITIZEN,
  level: 0,
  scoreHistory: []
};

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'دکتر علوی',
  email: 'alavi@edu.ir',
  role: UserRole.TEACHER,
  level: 5,
  scoreHistory: []
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'مدیر سامانه',
  email: 'admin@cogni.ir',
  role: UserRole.ADMIN,
  level: 10,
  scoreHistory: []
};

export const PLACEMENT_EXAM: Exam = {
  id: 'placement',
  contentId: 'none',
  title: 'آزمون تعیین سطح شناختی اولیه',
  isActive: true,
  timeLimit: 20,
  questions: [
    {
      id: 'p1',
      text: 'کدام یک از مهارت‌های زیر در حل مسائل پیچیده نقش کلیدی دارد؟',
      type: QuestionType.MCQ,
      options: ['تفکر انتقادی', 'حافظه کوتاه‌مدت', 'سرعت تایپ', 'قدرت بدنی'],
      correctOption: 0
    },
    {
      id: 'p2',
      text: 'توضیح دهید چگونه مدیریت زمان می‌تواند بر کاهش استرس شناختی موثر باشد؟',
      type: QuestionType.DESCRIPTIVE
    }
  ]
};

export const MOCK_CONTENTS: Content[] = [
  {
    id: 'c1',
    title: 'اصول حافظه فعال',
    description: 'آشنایی با مکانیزم‌های ذخیره‌سازی اطلاعات در مغز.',
    type: ContentType.TEXT,
    minLevel: 1,
    maxLevel: 3,
    durationMinutes: 15,
    authorId: 't1',
    isActive: true,
    body: 'حافظه فعال یکی از حیاتی‌ترین بخش‌های سیستم شناختی انسان است...'
  },
  {
    id: 'c2',
    title: 'تمرکز حواس در محیط کار',
    description: 'چگونه تمرکز خود را در محیط‌های شلوغ حفظ کنیم؟',
    type: ContentType.VIDEO,
    minLevel: 2,
    maxLevel: 5,
    durationMinutes: 10,
    authorId: 't1',
    isActive: true,
    videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'e1',
    contentId: 'c1',
    title: 'کوییز اصول حافظه فعال',
    isActive: true,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        text: 'ظرفیت متوسط حافظه فعال چند واحد است؟',
        type: QuestionType.MCQ,
        options: ['۳', '۷', '۱۲', '۲۰'],
        correctOption: 1
      }
    ]
  }
];
