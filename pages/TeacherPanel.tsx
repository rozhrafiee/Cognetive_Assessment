
import React, { useState } from 'react';
import { User, Attempt, Content, Exam, ContentType, QuestionType, Question } from '../types';
import { suggestDescriptiveGrade } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TeacherPanelProps {
  user: User;
  attempts: Attempt[];
  onUpdateAttempts: (attempts: Attempt[]) => void;
  contents: Content[];
  onUpdateContents: (contents: Content[]) => void;
  exams: Exam[];
  onUpdateExams: (exams: Exam[]) => void;
}

const TeacherPanel: React.FC<TeacherPanelProps> = ({ 
  user, 
  attempts, 
  onUpdateAttempts, 
  contents, 
  onUpdateContents,
  exams,
  onUpdateExams
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'grading' | 'content' | 'analytics'>('grading');
  const [gradingDetails, setGradingDetails] = useState<{ attemptId: string; suggestion?: { score: number; reason: string }; loading: boolean } | null>(null);
  
  // Create Content States
  const [showAddContent, setShowAddContent] = useState(false);
  const [newContent, setNewContent] = useState<Partial<Content>>({
    type: ContentType.TEXT,
    minLevel: 1,
    isActive: true
  });

  // Create Exam States
  const [showAddExam, setShowAddExam] = useState<string | null>(null); // contentId
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    questions: [],
    timeLimit: 15,
    isActive: true
  });

  const pendingAttempts = attempts.filter(a => !a.isGraded);
  const teacherContents = contents.filter(c => c.authorId === user.id);
  
  const gradedAttempts = attempts.filter(a => a.isGraded);
  const avgScore = gradedAttempts.length > 0 
    ? (gradedAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedAttempts.length).toFixed(1)
    : 0;

  const chartData = gradedAttempts.slice(-10).map((a, i) => ({
    name: `آزمون ${i+1}`,
    score: a.score
  }));

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    const content: Content = {
      ...newContent as Content,
      id: 'c' + Math.random().toString(36).substr(2, 5),
      authorId: user.id,
      maxLevel: 10,
      durationMinutes: 15
    };
    onUpdateContents([...contents, content]);
    setShowAddContent(false);
    setNewContent({ type: ContentType.TEXT, minLevel: 1, isActive: true });
  };

  const handleAddQuestion = () => {
    const q: Question = {
      id: 'q' + Math.random().toString(36).substr(2, 5),
      text: '',
      type: QuestionType.MCQ,
      options: ['', '', '', ''],
      correctOption: 0
    };
    setNewExam(prev => ({ ...prev, questions: [...(prev.questions || []), q] }));
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddExam) return;
    const exam: Exam = {
      ...newExam as Exam,
      id: 'e' + Math.random().toString(36).substr(2, 5),
      contentId: showAddExam,
      title: `آزمون ${contents.find(c => c.id === showAddExam)?.title}`
    };
    onUpdateExams([...exams, exam]);
    setShowAddExam(null);
    setNewExam({ questions: [], timeLimit: 15, isActive: true });
  };

  const handleSuggestGrade = async (attempt: Attempt) => {
    setGradingDetails({ attemptId: attempt.id, loading: true });
    const suggestion = await suggestDescriptiveGrade("ارزیابی پاسخ شناختی", JSON.stringify(attempt.answers));
    setGradingDetails({ attemptId: attempt.id, suggestion, loading: false });
  };

  const submitGrade = (attemptId: string, score: number) => {
    const updated = attempts.map(a => a.id === attemptId ? { ...a, score, isGraded: true } : a);
    onUpdateAttempts(updated);
    setGradingDetails(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-5 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">مدیریت سنجش شناختی</h2>
          <p className="text-slate-500 mt-2">خوش آمدید دکتر {user.name}. ابزارهای کنترلی استاد در دسترس شماست.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-indigo-50 px-6 py-3 rounded-2xl border border-indigo-100 hidden md:block text-center">
            <p className="text-[10px] text-indigo-400 font-bold uppercase">میانگین نمرات کل</p>
            <p className="text-xl font-black text-indigo-600">{avgScore} %</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-slate-200">
        {[
          { id: 'grading', label: 'تصحیح آزمون‌ها', count: pendingAttempts.length },
          { id: 'content', label: 'مدیریت محتوا', count: teacherContents.length },
          { id: 'analytics', label: 'تحلیل عملکرد (Analytics)', count: null }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`pb-4 px-2 font-bold transition-all relative ${activeSubTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.label} {tab.count !== null ? `(${tab.count})` : ''}
            {activeSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
          </button>
        ))}
      </div>

      {activeSubTab === 'grading' && (
        <div className="grid grid-cols-1 gap-6">
          {pendingAttempts.length > 0 ? pendingAttempts.map(attempt => (
            <div key={attempt.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:border-indigo-200 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl">👤</div>
                  <div>
                    <p className="font-bold text-slate-800">کاربر سیستم (شناسه: {attempt.userId})</p>
                    <p className="text-xs text-slate-400">آزمون: {exams.find(e => e.id === attempt.examId)?.title}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSuggestGrade(attempt)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition">دستیار هوشمند</button>
                  <button onClick={() => submitGrade(attempt.id, 85)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">ثبت نمره ۸۵</button>
                </div>
              </div>
              {gradingDetails?.attemptId === attempt.id && (
                <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                  {gradingDetails.loading ? <p className="text-indigo-600 font-bold animate-pulse">در حال تحلیل پاسخ...</p> : (
                    <div className="space-y-3">
                      <p className="text-sm font-black text-indigo-900">پیشنهاد سیستم: {gradingDetails.suggestion?.score} / ۱۰۰</p>
                      <p className="text-xs text-slate-600 italic">"{gradingDetails.suggestion?.reason}"</p>
                      <button onClick={() => submitGrade(attempt.id, gradingDetails.suggestion!.score)} className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold">تایید و ثبت نهایی</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">آزمون جدیدی برای تصحیح یافت نشد.</div>}
        </div>
      )}

      {activeSubTab === 'content' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAddContent(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              <span>+</span> ایجاد محتوای جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherContents.map(c => (
              <div key={c.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col group">
                <div className="flex justify-between mb-4">
                  <span className="text-2xl">{c.type === ContentType.VIDEO ? '🎬' : '📑'}</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">سطح {c.minLevel}</span>
                </div>
                <h4 className="font-bold mb-2">{c.title}</h4>
                <p className="text-slate-400 text-xs mb-4 line-clamp-2">{c.description}</p>
                <div className="mt-auto flex justify-between items-center gap-2 pt-4 border-t border-slate-50">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowAddExam(c.id)}
                      className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition"
                    >
                      {exams.find(e => e.contentId === c.id) ? 'ویرایش آزمون' : '+ تعریف آزمون'}
                    </button>
                    <button onClick={() => onUpdateContents(contents.filter(item => item.id !== c.id))} className="text-red-500 text-[10px] font-bold hover:underline">حذف</button>
                  </div>
                  {exams.find(e => e.contentId === c.id) && <span className="text-[9px] text-green-500 font-bold">✓ دارای آزمون</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Add Content Modal */}
          {showAddContent && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
              <form onSubmit={handleCreateContent} className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-8 space-y-4 animate-in zoom-in-95">
                <h3 className="text-2xl font-black mb-6">ایجاد محتوای آموزشی</h3>
                <div>
                  <label className="block text-sm font-bold mb-1 px-2">عنوان محتوا</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none" onChange={e => setNewContent({...newContent, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 px-2">توضیح کوتاه</label>
                  <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none" onChange={e => setNewContent({...newContent, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 px-2">نوع محتوا</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none" onChange={e => setNewContent({...newContent, type: e.target.value as ContentType})}>
                      <option value={ContentType.TEXT}>متنی</option>
                      <option value={ContentType.VIDEO}>ویدیویی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 px-2">حداقل سطح (۱-۱۰)</label>
                    <input type="number" min="1" max="10" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none" onChange={e => setNewContent({...newContent, minLevel: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1 px-2">متن یا لینک ویدیو</label>
                  <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 outline-none h-32" onChange={e => setNewContent({...newContent, body: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold">ذخیره محتوا</button>
                  <button type="button" onClick={() => setShowAddContent(false)} className="flex-1 bg-slate-100 py-3 rounded-2xl font-bold">انصراف</button>
                </div>
              </form>
            </div>
          )}

          {/* Add Exam Modal */}
          {showAddExam && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
              <form onSubmit={handleCreateExam} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl p-8 space-y-6 animate-in zoom-in-95">
                <h3 className="text-2xl font-black">تعریف آزمون برای "{contents.find(c => c.id === showAddExam)?.title}"</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-500">سوالات آزمون</h4>
                    <button type="button" onClick={handleAddQuestion} className="text-indigo-600 font-bold text-sm">+ افزودن سوال</button>
                  </div>
                  
                  {newExam.questions?.map((q, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-400">سوال {idx + 1}</span>
                        <select 
                          className="text-[10px] bg-white border rounded-lg px-2 py-1 outline-none"
                          value={q.type}
                          onChange={e => {
                            const qs = [...newExam.questions!];
                            qs[idx].type = e.target.value as QuestionType;
                            setNewExam({...newExam, questions: qs});
                          }}
                        >
                          <option value={QuestionType.MCQ}>تستی (MCQ)</option>
                          <option value={QuestionType.DESCRIPTIVE}>تشریحی</option>
                        </select>
                      </div>
                      <input 
                        placeholder="متن سوال..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none"
                        onChange={e => {
                          const qs = [...newExam.questions!];
                          qs[idx].text = e.target.value;
                          setNewExam({...newExam, questions: qs});
                        }}
                      />
                      {q.type === QuestionType.MCQ && (
                        <div className="grid grid-cols-2 gap-2">
                          {q.options?.map((opt, oIdx) => (
                            <div key={oIdx} className="flex gap-2 items-center">
                              <input 
                                type="radio" 
                                name={`q-${idx}`} 
                                checked={q.correctOption === oIdx}
                                onChange={() => {
                                  const qs = [...newExam.questions!];
                                  qs[idx].correctOption = oIdx;
                                  setNewExam({...newExam, questions: qs});
                                }}
                              />
                              <input 
                                placeholder={`گزینه ${oIdx + 1}`}
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none"
                                value={opt}
                                onChange={e => {
                                  const qs = [...newExam.questions!];
                                  qs[idx].options![oIdx] = e.target.value;
                                  setNewExam({...newExam, questions: qs});
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {newExam.questions?.length === 0 && <p className="text-center py-10 text-slate-300 italic text-sm">هنوز سوالی اضافه نکرده‌اید.</p>}
                </div>

                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button type="submit" disabled={!newExam.questions?.length} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold disabled:opacity-50">ثبت نهایی آزمون</button>
                  <button type="button" onClick={() => setShowAddExam(null)} className="flex-1 bg-slate-100 py-3 rounded-2xl font-bold">انصراف</button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black mb-8 text-slate-800">روند نمرات اخیر کاربران</h3>
              <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" hide />
                       <YAxis hide domain={[0, 100]} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                       <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="bg-indigo-600 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <div>
                <p className="text-indigo-200 text-sm font-bold">تعداد کل پاسخ‌ها</p>
                <h4 className="text-5xl font-black mt-2">{attempts.length}</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between text-xs">
                    <span>نرخ قبولی (بالای ۷۰)</span>
                    <span>۸۲٪</span>
                 </div>
                 <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[82%]"></div>
                 </div>
                 <p className="text-[10px] opacity-70 leading-relaxed italic">
                   توصیه: محتواهای سطح ۴ با استقبال کمتری مواجه شده‌اند. پیشنهاد می‌شود سطح دشواری آن‌ها بازنگری شود.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherPanel;
