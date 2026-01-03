
import React, { useState } from 'react';
import { Exam, QuestionType } from '../types';

interface PlacementTestProps {
  exam: Exam;
  onComplete: (answers: any) => void;
}

const PlacementTestPage: React.FC<PlacementTestProps> = ({ exam, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<any>({});
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const currentQuestion = exam.questions[currentStep];

  const handleNext = () => {
    if (currentStep < exam.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center py-12 space-y-8">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-4xl shadow-2xl shadow-indigo-200 animate-bounce">
          🎯
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-slate-900">{exam.title}</h2>
          <p className="text-slate-500 text-lg">این آزمون جهت تشخیص سطح توانمندی‌های شناختی شما طراحی شده است. لطفا با دقت و حوصله پاسخ دهید.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">تعداد سوالات</p>
            <p className="text-xl font-bold">{exam.questions.length} سوال</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs text-slate-400 mb-1">زمان تخمینی</p>
            <p className="text-xl font-bold">{exam.timeLimit} دقیقه</p>
          </div>
        </div>
        <button 
          onClick={() => setIsStarted(true)}
          className="w-full bg-indigo-600 text-white text-xl font-black py-5 rounded-3xl hover:bg-indigo-700 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-100"
        >
          بسیار خب، شروع کنیم!
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">
      <div className="flex justify-between items-center px-4">
        <div className="text-slate-400 font-medium">سوال {currentStep + 1} از {exam.questions.length}</div>
        <div className="flex gap-1">
          {exam.questions.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-10 bg-indigo-600' : idx < currentStep ? 'w-4 bg-indigo-200' : 'w-4 bg-slate-100'}`}></div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-50 border border-slate-50 min-h-[400px] flex flex-col">
        <h3 className="text-2xl font-bold text-slate-800 leading-relaxed mb-10">
          {currentQuestion.text}
        </h3>

        <div className="flex-1 space-y-4">
          {currentQuestion.type === QuestionType.MCQ ? (
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setAnswers({...answers, [currentQuestion.id]: idx})}
                  className={`w-full text-right p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    answers[currentQuestion.id] === idx 
                      ? 'border-indigo-600 bg-indigo-50/50' 
                      : 'border-slate-100 hover:border-slate-300 bg-slate-50/30'
                  }`}
                >
                  <span className={`text-lg ${answers[currentQuestion.id] === idx ? 'text-indigo-700 font-bold' : 'text-slate-600'}`}>{option}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    answers[currentQuestion.id] === idx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 group-hover:border-slate-400'
                  }`}>
                    {answers[currentQuestion.id] === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-lg outline-none focus:border-indigo-400 focus:bg-white transition-all"
              placeholder="پاسخ خود را اینجا بنویسید..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
            />
          )}
        </div>

        <div className="mt-12 flex justify-between items-center">
           <button 
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="text-slate-400 font-bold px-6 py-3 hover:text-slate-900 disabled:opacity-0 transition"
          >
            قبلی
          </button>
          <button
            onClick={handleNext}
            disabled={answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === ''}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {currentStep === exam.questions.length - 1 ? 'پایان آزمون' : 'سوال بعدی'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementTestPage;
