
import React, { useState, useEffect, useRef } from 'react';
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
  const isFinishedRef = useRef(false);

  // PDF Implementation: Automatic expiry handling
  useEffect(() => {
    if (timeLeft <= 0 && !isFinishedRef.current) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    // Automated scoring logic from PDF
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

    const finalScore = hasDescriptive ? undefined : (mcqCount > 0 ? Math.round((mcqScore / mcqCount) * 100) : 100);
    onComplete(exam.id, answers, finalScore);
  };

  const currentQuestion = exam.questions[currentStep];
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col animate-in fade-in duration-500">
      <div className="bg-white px-8 py-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div>
          <h2 className="text-xl font-black text-slate-800">{exam.title}</h2>
          <p className="text-sm text-slate-400 mt-1">سوال {currentStep + 1} از {exam.questions.length}</p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xl border-2 transition-all ${timeLeft < 60 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>
          <span className="text-sm font-bold opacity-60 ml-2">زمان باقی‌مانده:</span>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex-1 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-50 overflow-y-auto">
        <div className="space-y-8">
           <div className="space-y-2">
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">محتوای ارزیابی</span>
              <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">{currentQuestion.text}</h3>
           </div>

           <div className="space-y-4">
              {currentQuestion.type === QuestionType.MCQ ? (
                <div className="grid grid-cols-1 gap-4">
                   {currentQuestion.options?.map((opt, idx) => (
                     <button 
                      key={idx}
                      onClick={() => setAnswers({...answers, [currentQuestion.id]: idx})}
                      className={`w-full text-right p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                        answers[currentQuestion.id] === idx ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                      }`}
                     >
                       <span className={`text-lg ${answers[currentQuestion.id] === idx ? 'font-bold text-indigo-700' : 'text-slate-600'}`}>{opt}</span>
                       <div className={`w-6 h-6 rounded-full border-2 transition-all ${answers[currentQuestion.id] === idx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-slate-400'}`}>
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
         <button onClick={onCancel} className="px-8 py-3 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition">انصراف</button>
         <div className="flex gap-3">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-8 py-3 font-bold text-slate-400 hover:text-slate-900 disabled:opacity-0"
            >
              قبلی
            </button>
            <button 
              onClick={() => currentStep === exam.questions.length - 1 ? handleFinish() : setCurrentStep(prev => prev + 1)}
              disabled={answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === ''}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition transform active:scale-95"
            >
              {currentStep === exam.questions.length - 1 ? 'پایان و ارسال' : 'سوال بعدی'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default ExamPage;
