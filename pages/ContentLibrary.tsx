
import React, { useState } from 'react';
import { Content, ContentType, Exam, ScenarioStep } from '../types';

interface ContentLibraryProps {
  contents: Content[];
  userLevel: number;
  exams: Exam[];
  onStartExam: (id: string) => void;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ contents, userLevel, exams, onStartExam }) => {
  const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [activeScenarioStep, setActiveScenarioStep] = useState<string | null>(null);

  const available = contents.filter(c => userLevel >= c.minLevel);
  const recommended = available.filter(c => c.minLevel === userLevel).slice(0, 2);
  const others = available.filter(c => !recommended.find(r => r.id === c.id));
  const locked = contents.filter(c => userLevel < c.minLevel);

  const filterItems = (items: Content[]) => 
    items.filter(c => filterType === 'ALL' || c.type === filterType);

  const renderScenario = (content: Content) => {
    if (!content.scenarioSteps) return null;
    const currentStep = content.scenarioSteps.find(s => s.id === (activeScenarioStep || content.scenarioSteps![0].id));
    
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
        <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 text-indigo-900 leading-loose text-lg font-medium">
          {currentStep?.text}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentStep?.options.map((opt, i) => (
            <button 
              key={i}
              onClick={() => {
                if (opt.nextStepId) {
                  setActiveScenarioStep(opt.nextStepId);
                } else {
                  alert(`پایان سناریو: ${opt.feedback}`);
                  setSelectedContent(null);
                  setActiveScenarioStep(null);
                }
              }}
              className="bg-white border-2 border-slate-100 p-6 rounded-2xl text-right hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <p className="font-bold text-slate-800 group-hover:text-indigo-700">{opt.text}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900">ماژول یادگیری تطبیقی</h2>
          <p className="text-slate-500 mt-2 font-medium">محتوای شخصی‌سازی شده برای مدیران و شهروندان سطح {userLevel}</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit">
          {['ALL', ContentType.TEXT, ContentType.VIDEO, ContentType.SCENARIO].map(t => (
            <button 
              key={t}
              onClick={() => setFilterType(t as any)}
              className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${filterType === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {t === 'ALL' ? 'همه' : t === ContentType.TEXT ? 'آموزش متنی' : t === ContentType.VIDEO ? 'ویدیو' : 'سناریو تعاملی'}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section */}
      {recommended.length > 0 && filterType === 'ALL' && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="bg-orange-500 w-2 h-8 rounded-full"></span>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">پیشنهاد هوشمند سیستم</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recommended.map(content => (
              <div 
                key={content.id} 
                onClick={() => setSelectedContent(content)}
                className="group relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-indigo-200 cursor-pointer overflow-hidden transform hover:scale-[1.01] transition-all"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>
                <div className="flex justify-between items-start mb-8">
                  <span className="text-5xl">{content.type === ContentType.SCENARIO ? '🎭' : content.type === ContentType.VIDEO ? '🎬' : '📑'}</span>
                  <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md uppercase tracking-widest">توصیه شده برای سطح شما</span>
                </div>
                <h4 className="text-3xl font-black mb-4 leading-tight">{content.title}</h4>
                <p className="text-indigo-100 text-sm font-medium line-clamp-2 opacity-80">{content.description}</p>
                <div className="mt-8 flex items-center gap-2 text-xs font-black text-white/60">
                  <span>مشاهده سناریو</span>
                  <span className="group-hover:translate-x-[-4px] transition-transform">←</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Other Contents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filterItems(others).map(content => (
          <div key={content.id} onClick={() => setSelectedContent(content)} className="bg-white rounded-[3rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className="aspect-video bg-slate-50 rounded-[2rem] mb-6 flex items-center justify-center text-4xl group-hover:bg-indigo-50 transition-colors">
              {content.type === ContentType.SCENARIO ? '🎭' : content.type === ContentType.VIDEO ? '🎬' : '📑'}
            </div>
            <h4 className="font-black text-xl text-slate-800 mb-3">{content.title}</h4>
            <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2 mb-6">{content.description}</p>
            <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase">سطح {content.minLevel}</span>
               <span className="text-indigo-600 font-black text-xs group-hover:underline">ورود ←</span>
            </div>
          </div>
        ))}

        {filterItems(locked).map(content => (
          <div key={content.id} className="bg-slate-100 rounded-[3rem] p-10 border border-slate-200 flex flex-col items-center justify-center text-center opacity-60 grayscale relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center gap-4">
               <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl backdrop-blur-md">🔒</div>
               <p className="font-black text-slate-800 bg-white/80 px-4 py-2 rounded-full text-xs">نیازمند سطح شناختی {content.minLevel}</p>
            </div>
            <h4 className="font-bold text-slate-400 text-lg">{content.title}</h4>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{selectedContent.type}</span>
                <h3 className="text-3xl font-black mt-1">{selectedContent.title}</h3>
              </div>
              <button onClick={() => { setSelectedContent(null); setActiveScenarioStep(null); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl shadow-sm transition-colors text-2xl">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-12 leading-[2.2] text-slate-700 font-medium text-lg">
              {selectedContent.type === ContentType.SCENARIO ? renderScenario(selectedContent) : (selectedContent.body || "محتوای متنی یافت نشد.")}
            </div>
            <div className="p-10 bg-slate-50 flex justify-end gap-6 items-center">
               <p className="text-xs text-slate-400 font-bold ml-auto">زمان تخمینی مطالعه: {selectedContent.durationMinutes} دقیقه</p>
               {exams.find(e => e.contentId === selectedContent.id) && (
                 <button 
                  onClick={() => onStartExam(exams.find(e => e.contentId === selectedContent.id)!.id)}
                  className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
                 >
                  شروع ارزیابی نهایی
                 </button>
               )}
               <button onClick={() => { setSelectedContent(null); setActiveScenarioStep(null); }} className="px-8 py-4 font-black text-slate-500 hover:text-slate-900 transition-colors">بستن پنجره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;
