
import React, { useState, useEffect } from 'react';
import { Exam, QuestionType } from '../types';

interface ExamPageProps {
  exam: Exam;
  onComplete: (examId: string, answers: any, score?: number) => void;
  onCancel: () => void;
}

const ExamPage: React.FC<ExamPageProps> = ({ exam, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<any>({});
  const [timeLeft, setTimeLeft] = useState(exam.timeLimit * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    // Basic automatic grading for MCQ
    let mcqScore = 0;
    let mcqCount = 0;
    let hasDescriptive = false;

    exam.questions.forEach(q => {
      if (q.type === QuestionType.MCQ) {
        mcqCount++;
        if (answers[q.id] === q.correctOption) mcqScore++;
      } else {
        hasDescriptive = true;
      }
    });

    const finalScore = hasDescriptive ? undefined : (mcqCount > 0 ? (mcqScore / mcqCount) * 100 : 100);
    onComplete(exam.id, answers, finalScore);
  };

  const currentQuestion = exam.questions[currentStep];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <div className="bg-white px-8 py-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-black text-slate-800">{exam.title}</h2>
          <p className="text-sm text-slate-400 mt-1">سوال {currentStep + 1} از {exam.questions.length}</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xl border-2 transition-colors ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100 overflow-y-auto">
        <div className="space-y-8">
           <div className="space-y-4">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">صورت سوال</span>
              <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">{currentQuestion.text}</h3>
           </div>

           <div className="space-y-4">
              {currentQuestion.type === QuestionType.MCQ ? (
                <div className="grid grid-cols-1 gap-4">
                   {currentQuestion.options?.map((opt, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setAnswers({...answers, [currentQuestion.id]: idx})}
                      className={`w-full text-right p-6 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        answers[currentQuestion.id] === idx ? 'border-indigo-600 bg-indigo-50/30 ring-4 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                      }`}
                     >
                       <span className={`text-lg ${answers[currentQuestion.id] === idx ? 'font-bold text-indigo-700' : 'text-slate-600'}`}>{opt}</span>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === idx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                          {answers[currentQuestion.id] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                       </div>
                     </button>
                   ))}
                </div>
              ) : (
                <textarea 
                  className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-8 text-lg outline-none focus:border-indigo-400 focus:bg-white transition-all shadow-inner"
                  placeholder="پاسخ خود را شرح دهید..."
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                />
              )}
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex justify-between items-center sticky bottom-0">
         <button 
          onClick={onCancel}
          className="px-8 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition"
         >
          انصراف و خروج
         </button>
         <div className="flex gap-3">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-8 py-3 font-bold text-slate-500 hover:text-slate-900 disabled:opacity-0"
            >
              سوال قبلی
            </button>
            <button 
              onClick={() => currentStep === exam.questions.length - 1 ? handleFinish() : setCurrentStep(prev => prev + 1)}
              disabled={answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === ''}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {currentStep === exam.questions.length - 1 ? 'ارسال نهایی پاسخ‌ها' : 'سوال بعدی'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ExamPage;
