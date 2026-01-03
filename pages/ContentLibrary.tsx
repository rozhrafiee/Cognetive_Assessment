
import React, { useState } from 'react';
import { Content, ContentType, Exam, User } from '../types';

interface ContentLibraryProps {
  contents: Content[];
  userLevel: number;
  exams: Exam[];
  onStartExam: (id: string) => void;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ contents, userLevel, exams, onStartExam }) => {
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const filtered = contents.filter(c => {
    const levelMatch = userLevel >= c.minLevel;
    const typeMatch = filterType === 'ALL' || c.type === filterType;
    return levelMatch && typeMatch;
  });

  const locked = contents.filter(c => userLevel < c.minLevel);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">کتابخانه آموزشی</h2>
          <p className="text-slate-500 mt-2">محتواهای متناسب با سطح شما (سطح فعلی: {userLevel})</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button 
            onClick={() => setFilterType('ALL')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${filterType === 'ALL' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            همه
          </button>
          <button 
            onClick={() => setFilterType(ContentType.TEXT)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${filterType === ContentType.TEXT ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            متنی
          </button>
          <button 
            onClick={() => setFilterType(ContentType.VIDEO)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition ${filterType === ContentType.VIDEO ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
          >
            ویدیویی
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(content => (
          <div 
            key={content.id} 
            className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col cursor-pointer"
            onClick={() => setSelectedContent(content)}
          >
            <div className={`w-full aspect-video rounded-[2rem] mb-6 flex items-center justify-center text-5xl relative overflow-hidden ${content.type === ContentType.VIDEO ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {content.type === ContentType.VIDEO ? '🎬' : '📑'}
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                {content.durationMinutes} دقیقه
              </div>
            </div>
            <div className="px-2 pb-2 flex-1 flex flex-col">
              <h4 className="text-xl font-black text-slate-800 group-hover:text-indigo-600 transition">{content.title}</h4>
              <p className="text-slate-500 text-sm mt-3 line-clamp-2 leading-relaxed">{content.description}</p>
              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <span className="text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1 rounded-full uppercase">سطح {content.minLevel}-{content.maxLevel}</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-[-4px] transition flex items-center gap-1">
                  مشاهده محتوا
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </span>
              </div>
            </div>
          </div>
        ))}

        {locked.map(content => (
          <div key={content.id} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col items-center justify-center text-center opacity-70 grayscale relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4 text-slate-800">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg text-2xl">🔒</div>
               <p className="font-black text-lg">نیاز به سطح {content.minLevel}</p>
            </div>
            <h4 className="text-xl font-bold">{content.title}</h4>
          </div>
        ))}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black">{selectedContent.title}</h3>
                <p className="text-slate-500 text-sm">{selectedContent.type === ContentType.VIDEO ? 'محتوای ویدیویی' : 'محتوای متنی'} • {selectedContent.durationMinutes} دقیقه</p>
              </div>
              <button onClick={() => setSelectedContent(null)} className="p-3 hover:bg-slate-100 rounded-full transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10">
              {selectedContent.type === ContentType.VIDEO ? (
                <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
                   <p className="text-white font-bold">پخش‌کننده ویدیو (شبیه‌سازی)</p>
                </div>
              ) : (
                <div className="prose prose-lg prose-slate max-w-none leading-loose">
                  <p>{selectedContent.body}</p>
                  <p>این یک متن آموزشی نمونه است که برای تست سیستم طراحی شده است. سیستم‌های شناختی به ما اجازه می‌دهند تا اطلاعات را پردازش، ذخیره و بازیابی کنیم.</p>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
               <button 
                onClick={() => setSelectedContent(null)}
                className="px-8 py-3 font-bold text-slate-600"
               >
                بستن
               </button>
               {exams.find(e => e.contentId === selectedContent.id) ? (
                 <button 
                  onClick={() => onStartExam(exams.find(e => e.contentId === selectedContent.id)!.id)}
                  className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg"
                 >
                  شرکت در کوییز این درس
                 </button>
               ) : (
                 <button className="bg-green-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg" onClick={() => setSelectedContent(null)}>
                   تکمیل مطالعه
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
