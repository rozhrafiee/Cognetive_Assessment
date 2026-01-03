
import { Content, ContentType, Exam, QuestionType, User, UserRole } from './types';

export const INITIAL_USER: User = {
  id: 'u1',
  name: 'علی محمدی',
  email: 'ali@example.com',
  role: UserRole.CITIZEN,
  level: 0,
  scoreHistory: [],
  xp: 0
};

export const MOCK_TEACHER: User = {
  id: 't1',
  name: 'دکتر علوی',
  email: 'alavi@edu.ir',
  role: UserRole.TEACHER,
  level: 5,
  scoreHistory: [],
  xp: 5000
};

export const MOCK_ADMIN: User = {
  id: 'a1',
  name: 'مدیر سامانه',
  email: 'admin@cogni.ir',
  role: UserRole.ADMIN,
  level: 10,
  scoreHistory: [],
  xp: 10000
};

export const PLACEMENT_EXAM: Exam = {
  id: 'placement',
  contentId: 'none',
  title: 'آزمون تعیین سطح سواد شناختی جامعه',
  isActive: true,
  timeLimit: 20,
  questions: [
    {
      id: 'p1',
      text: 'در مواجهه با خبری که احساسات شدیدی (مانند خشم یا ترس) در شما ایجاد می‌کند، اولین اقدام منطقی چیست؟',
      type: QuestionType.MCQ,
      options: ['اشتراک‌گذاری فوری برای آگاه‌سازی دیگران', 'بررسی منبع خبر و جستجوی آن در خبرگزاری‌های معتبر', 'نادیده گرفتن کامل خبر', 'ارسال نظر تند زیر پست مربوطه'],
      correctOption: 1
    },
    {
      id: 'p2',
      text: 'توضیح دهید "اتاق پژواک" (Echo Chamber) در فضای مجازی چگونه باعث تقویت باورهای غلط می‌شود؟',
      type: QuestionType.DESCRIPTIVE
    }
  ]
};

export const MOCK_CONTENTS: Content[] = [
  {
    id: 's1',
    title: 'سناریو: بحران در مدیریت شهری',
    description: 'در نقش یک مدیر شهری، با یک کارزار پخش شایعه درباره کیفیت آب شرب مواجه شده‌اید. تصمیم بگیرید.',
    type: ContentType.SCENARIO,
    minLevel: 1,
    maxLevel: 5,
    durationMinutes: 10,
    authorId: 't1',
    isActive: true,
    scenarioSteps: [
      {
        id: 'start',
        text: 'ساعت ۸ صبح است. گزارش‌هایی از تجمعات کوچک در منطقه ۲ به دلیل شایعه‌ای مبنی بر آلودگی میکروبی آب به دست شما می‌رسد. شایعه در تلگرام در حال دست‌به‌دست شدن است. چه می‌کنید؟',
        options: [
          { text: 'تکذیبیه فوری صادر می‌کنم بدون داشتن نتایج آزمایشگاهی', impact: -10, feedback: 'عجله در تکذیب بدون سند ممکن است بی‌اعتمادی را بیشتر کند.', nextStepId: 'crisis' },
          { text: 'تیم‌های آزمایشگاهی را اعزام کرده و از مردم می‌خواهم تا زمان نتیجه نهایی آرامش خود را حفظ کنند.', impact: 20, feedback: 'تصمیم درست و مبتنی بر شواهد.', nextStepId: 'results' }
        ]
      },
      {
        id: 'crisis',
        text: 'مردم به تکذیبیه شما اعتماد نکرده‌اند و تجمع بزرگتر شده است. رسانه‌های خارجی در حال پوشش اخبار هستند. مرحله بعد؟',
        options: [
          { text: 'درخواست برخورد امنیتی با تجمع‌کنندگان', impact: -30, feedback: 'این کار باعث تقویت روایت‌های منفی دشمن می‌شود.', nextStepId: 'end_fail' },
          { text: 'حضور مستقیم در میان مردم و ارائه شفاف گزارش‌ها', impact: 15, feedback: 'صداقت همیشه بهترین سیاست در جنگ شناختی است.', nextStepId: 'end_success' }
        ]
      },
      {
        id: 'results',
        text: 'نتایج آزمایشگاه نشان می‌دهد آب کاملاً سالم است و شایعه توسط یک اکانت جعلی ساخته شده. چگونه اطلاع‌رسانی می‌کنید؟',
        options: [
          { text: 'انتشار ویدیو از آزمایشگاه و معرفی منبع شایعه', impact: 40, feedback: 'عالی! شفافیت و افشای منبع تهدید، سواد شناختی جامعه را بالا می‌برد.', nextStepId: 'end_success' }
        ]
      },
      {
        id: 'end_success', text: 'شما با موفقیت بحران را مدیریت کردید. جامعه اکنون به سیستم مدیریت شهری اعتماد بیشتری دارد.', options: []
      },
      {
        id: 'end_fail', text: 'متأسفانه مدیریت شما باعث تشدید بحران شناختی شد. نیاز به بازآموزی دارید.', options: []
      }
    ]
  },
  {
    id: 'c1',
    title: 'تکنیک‌های راستی‌آزمایی محتوا',
    description: 'روش‌های علمی برای تشخیص فیک‌نیوز و بررسی منابع خبری.',
    type: ContentType.TEXT,
    minLevel: 1,
    maxLevel: 3,
    durationMinutes: 15,
    authorId: 't1',
    isActive: true,
    body: 'در عصر انفجار اطلاعات، هر شهروند باید یک "دروازه‌بان خبری" باشد. اولین قدم در راستی‌آزمایی...'
  }
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'e1',
    contentId: 'c1',
    title: 'کوییز مهارت‌های راستی‌آزمایی',
    isActive: true,
    timeLimit: 10,
    questions: [
      {
        id: 'q1',
        text: 'اصطلاح "Deepfake" به چه معناست؟',
        type: QuestionType.MCQ,
        options: ['عکس‌های قدیمی با کیفیت پایین', 'ویدیوهای جعلی ساخته شده با هوش مصنوعی', 'اخبار منتشر شده در روزنامه‌ها', 'حملات سایبری به سرورها'],
        correctOption: 1
      }
    ]
  }
];
