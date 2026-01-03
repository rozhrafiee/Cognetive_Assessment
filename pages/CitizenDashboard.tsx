
import React, { useState, useEffect } from 'react';
import { User, Attempt, SystemAlert } from '../types';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getCognitiveInsight } from '../services/geminiService';

interface CitizenDashboardProps {
  user: User;
  attempts: Attempt[];
  alerts: SystemAlert[];
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, attempts, alerts }) => {
  const [insight, setInsight] = useState<string>('در حال تحلیل الگوی شناختی شما توسط هوش مصنوعی...');
  const userAttempts = attempts.filter(a => a.userId === user.id && a.isGraded);
  
  const xpInCurrentLevel = user.xp % 1000;
  const progressPercent = (xpInCurrentLevel / 1000) * 100;

  useEffect(() => {
    const fetchInsight = async () => {
      if (userAttempts.length > 0) {
        const text = await getCognitiveInsight(user.name, userAttempts.map(a => a.score));
        setInsight(text || '');
      } else {
        setInsight('هنوز داده‌ای برای تحلیل وجود ندارد. با شرکت در اولین سناریو، تحلیل هوشمند فعال می‌شود.');
      }
    };
    fetchInsight();
  }, [userAttempts.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">پنل سواد شناختی</h2>
          <p className="text-slate-500 mt-2 font-medium">پایش مستمر توانمندی‌ها و هشدارهای جامعه شهری</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm">
          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-bold uppercase">امتیاز کل (XP)</p>
            <p className="text-xl font-black text-indigo-600">{user.xp?.toLocaleString()}</p>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100">🏆</div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Alerts Section (Analysis & Feedback Module) */}
        <div className="col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800">هشدارهای شهری</h3>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black">{alerts.length} مورد</span>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-64 scrollbar-hide">
            {alerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-2xl border-r-4 ${alert.severity === 'high' ? 'bg-red-50 border-red-500 text-red-900' : 'bg-orange-50 border-orange-500 text-orange-900'}`}>
                <p className="font-bold text-sm mb-1">{alert.title}</p>
                <p className="text-xs opacity-80 leading-relaxed">{alert.message}</p>
                <p className="text-[9px] mt-2 opacity-50">{new Date(alert.date).toLocaleDateString('fa-IR')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cognitive Level (Assessment Module) */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">سطح سواد شناختی</p>
              <h4 className="text-7xl font-black mt-2">Level {user.level}</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">رتبه در منطقه شهری</p>
              <p className="text-2xl font-black">#۱۲۸</p>
            </div>
          </div>
          
          <div className="relative z-10 mt-12">
            <div className="flex justify-between text-xs mb-3 font-bold">
              <span className="text-indigo-300">پیشرفت تا سطح {user.level + 1}</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden p-1 backdrop-blur-md">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] mt-3 text-slate-400">با کسب {1000 - xpInCurrentLevel} امتیاز دیگر به سطح بعدی ارتقا می‌یابید.</p>
          </div>
        </div>
      </div>

      {/* AI Analysis (Analysis & Feedback Module) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl">✨</div>
            <h3 className="text-xl font-black">تحلیل هوشمند الگوی ذهنی</h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 leading-loose text-sm whitespace-pre-wrap">
            "{insight}"
          </div>
        </div>

        {/* Progress Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-black mb-6">نمودار پایداری شناختی</h3>
          <div className="flex-1 h-48">
            {userAttempts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userAttempts.slice(-7).map(a => ({ date: '', score: a.score }))}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2">
                <span className="text-4xl">📉</span>
                <p className="text-xs font-bold">داده کافی برای رسم نمودار وجود ندارد.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
