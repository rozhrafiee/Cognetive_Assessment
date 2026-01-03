
import React, { useState } from 'react';
import { User, Attempt, UserRole } from '../types';
import { suggestDescriptiveGrade } from '../services/geminiService';

interface TeacherPanelProps {
  user: User;
  attempts: Attempt[];
  onUpdateAttempts: (attempts: Attempt[]) => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ user, attempts, onUpdateAttempts }) => {
  const [activeSubTab, setActiveSubTab] = useState<'grading' | 'content'>('grading');
  const [gradingDetails, setGradingDetails] = useState<{ attemptId: string; suggestion?: { score: number; reason: string }; loading: boolean } | null>(null);

  const pendingAttempts = attempts.filter(a => !a.isGraded);

  const handleSuggestGrade = async (attempt: Attempt) => {
    setGradingDetails({ attemptId: attempt.id, loading: true });
    // In a real app, find the specific descriptive question from the exam
    const suggestion = await suggestDescriptiveGrade("سوال تشریحی آزمون", JSON.stringify(attempt.answers));
    setGradingDetails({ attemptId: attempt.id, suggestion, loading: false });
  };

  const submitGrade = (attemptId: string, score: number) => {
    const updated = attempts.map(a => a.id === attemptId ? { ...a, score, isGraded: true } : a);
    onUpdateAttempts(updated);
    setGradingDetails(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">پنل مدیریت استاد</h2>
          <p className="text-slate-500 mt-2">خوش آمدید دکتر علوی. مدیریت محتوا و تصحیح آزمون‌ها را اینجا انجام دهید.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition">+ محتوای جدید</button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveSubTab('grading')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeSubTab === 'grading' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          در انتظار تصحیح ({pendingAttempts.length})
          {activeSubTab === 'grading' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
        <button 
          onClick={() => setActiveSubTab('content')}
          className={`pb-4 px-2 font-bold transition-all relative ${activeSubTab === 'content' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          محتواهای من
          {activeSubTab === 'content' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
        </button>
      </div>

      {activeSubTab === 'grading' ? (
        <div className="grid grid-cols-1 gap-6">
          {pendingAttempts.length > 0 ? pendingAttempts.map(attempt => (
            <div key={attempt.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl">👤</div>
                 <div>
                    <p className="text-xs text-slate-400 mb-1">کد کاربر: {attempt.userId}</p>
                    <p className="font-bold text-lg">آزمون {attempt.examId === 'placement' ? 'تعیین سطح' : 'کوییز درس'}</p>
                    <p className="text-xs text-slate-400">{new Date(attempt.date).toLocaleString('fa-IR')}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => handleSuggestGrade(attempt)}
                  className="px-6 py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition"
                 >
                  دریافت پیشنهاد هوش مصنوعی
                 </button>
                 <button 
                   onClick={() => submitGrade(attempt.id, 85)}
                   className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-md"
                 >
                  تصحیح دستی
                 </button>
              </div>

              {gradingDetails?.attemptId === attempt.id && (
                <div className="w-full mt-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in fade-in zoom-in duration-300">
                  {gradingDetails.loading ? (
                    <div className="flex items-center gap-3 text-indigo-600 font-bold">
                       <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                       در حال تحلیل توسط جمینای...
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <h4 className="font-bold text-indigo-900">پیشنهاد هوش مصنوعی:</h4>
                          <span className="text-2xl font-black text-indigo-700">{gradingDetails.suggestion?.score} / ۱۰۰</span>
                       </div>
                       <p className="text-slate-600 italic leading-relaxed">"{gradingDetails.suggestion?.reason}"</p>
                       <div className="flex gap-2">
                          <button onClick={() => submitGrade(attempt.id, gradingDetails.suggestion!.score)} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg">تایید پیشنهاد</button>
                          <button onClick={() => setGradingDetails(null)} className="px-6 py-3 border border-indigo-200 text-indigo-600 rounded-xl font-bold">انصراف</button>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 text-slate-400">
               هیچ آزمونی در انتظار تصحیح نیست.
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="font-bold text-lg mb-2">اصول حافظه فعال</h4>
              <p className="text-slate-400 text-sm mb-4">سطح ۱ تا ۳ • ۱۲ شرکت‌کننده</p>
              <div className="flex justify-end gap-2">
                 <button className="text-indigo-600 font-bold px-4 py-2 hover:bg-indigo-50 rounded-lg">ویرایش</button>
                 <button className="text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-lg">حذف</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
