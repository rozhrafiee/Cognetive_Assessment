
import React, { useState } from 'react';
import { Content, ContentType, Exam } from '../types';

interface ContentLibraryProps {
  contents: Content[];
  userLevel: number;
  exams: Exam[];
  onStartExam: (id: string) => void;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ contents, userLevel, exams, onStartExam }) => {
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // PDF Implementation: Cognitive Level Filtering (1-10)
  const available = contents.filter(c => userLevel >= c.minLevel);
  const recommended = available.filter(c => c.minLevel === userLevel).slice(0, 2);
  const others = available.filter(c => !recommended.find(r => r.id === c.id));
  const locked = contents.filter(c => userLevel < c.minLevel);

  const filterItems = (items: Content[]) => 
    items.filter(c => filterType === 'ALL' || c.type === filterType);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">کتابخانه محتوای تطبیقی</h2>
          <p className="text-slate-500 mt-2">محتواهای هوشمند بر اساس سطح {userLevel} شما</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
          {['ALL', ContentType.TEXT, ContentType.VIDEO].map(t => (
            <button 
              key={t}
              onClick={() => setFilterType(t as any)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${filterType === t ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {t === 'ALL' ? 'همه' : t === ContentType.TEXT ? 'متنی' : 'ویدیویی'}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section (Adaptive Engine Feature) */}
      {recommended.length > 0 && filterType === 'ALL' && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 w-2 h-6 rounded-full"></span>
            <h3 className="text-xl font-black text-slate-800">پیشنهاد هوش مصنوعی برای سطح شما</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommended.map(content => (
              <div 
                key={content.id} 
                onClick={() => setSelectedContent(content)}
                className="group relative bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 cursor-pointer overflow-hidden transform hover:scale-[1.02] transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl">{content.type === ContentType.VIDEO ? '🎬' : '📑'}</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md">توصیه شده</span>
                </div>
                <h4 className="text-2xl font-black mb-2">{content.title}</h4>
                <p className="text-indigo-100 text-sm line-clamp-2">{content.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filterItems(others).map(content => (
          <div key={content.id} onClick={() => setSelectedContent(content)} className="bg-white rounded-[2.5rem] p-5 border border-slate-100 shadow-sm hover:shadow-lg transition-all cursor-pointer">
            <div className="aspect-video bg-slate-50 rounded-[2rem] mb-4 flex items-center justify-center text-3xl">
              {content.type === ContentType.VIDEO ? '🎬' : '📑'}
            </div>
            <h4 className="font-black text-lg">{content.title}</h4>
            <p className="text-slate-400 text-xs mt-2 line-clamp-2">{content.description}</p>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold text-slate-400">
               <span>سطح مجاز: {content.minLevel}</span>
               <span className="text-indigo-600">مشاهده محتوا ←</span>
            </div>
          </div>
        ))}

        {filterItems(locked).map(content => (
          <div key={content.id} className="bg-slate-100 rounded-[2.5rem] p-8 border border-slate-200 flex flex-col items-center justify-center text-center opacity-60 grayscale relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-3">
               <span className="text-2xl">🔒</span>
               <p className="font-black text-slate-800">نیازمند سطح {content.minLevel}</p>
            </div>
            <h4 className="font-bold text-slate-400">{content.title}</h4>
          </div>
        ))}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black">{selectedContent.title}</h3>
              <button onClick={() => setSelectedContent(null)} className="p-2 hover:bg-slate-100 rounded-full">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 leading-loose text-slate-700">
              {selectedContent.body || "محتوای متنی یافت نشد."}
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4">
               {exams.find(e => e.contentId === selectedContent.id) && (
                 <button 
                  onClick={() => onStartExam(exams.find(e => e.contentId === selectedContent.id)!.id)}
                  className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100"
                 >
                  شروع ارزیابی شناختی محتوا
                 </button>
               )}
               <button onClick={() => setSelectedContent(null)} className="px-6 py-3 font-bold text-slate-500">بستن</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
