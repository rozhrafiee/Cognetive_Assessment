
import React, { useState, useEffect } from 'react';
import { User, Attempt } from '../types';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { getCognitiveInsight } from '../services/geminiService';

interface CitizenDashboardProps {
  user: User;
  attempts: Attempt[];
}

const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ user, attempts }) => {
  const [insight, setInsight] = useState<string>('در حال تحلیل اطلاعات شما توسط هوش مصنوعی...');
  const userAttempts = attempts.filter(a => a.userId === user.id && a.isGraded);
  
  // Progress calculation for UI
  const currentLevelAttempts = userAttempts.filter(a => a.examId !== 'placement').length;
  const progressPercent = Math.min((currentLevelAttempts / 3) * 100, 100);

  const chartData = userAttempts.map(a => ({
    date: new Date(a.date).toLocaleDateString('fa-IR'),
    score: a.score
  })).slice(-7);

  useEffect(() => {
    const fetchInsight = async () => {
      if (userAttempts.length > 0) {
        const text = await getCognitiveInsight(user.name, userAttempts.map(a => a.score));
        setInsight(text || '');
      } else {
        setInsight('هنوز داده‌ای برای تحلیل وجود ندارد. در آزمون‌ها شرکت کنید تا تحلیل‌های هوشمند فعال شوند.');
      }
    };
    fetchInsight();
  }, [userAttempts.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900">سلام، {user.name} عزیز!</h2>
          <p className="text-slate-500 mt-2">خوش آمدید. در اینجا نمایی کلی از روند رشد شناختی خود را مشاهده می‌کنید.</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 text-2xl font-bold">
              🔥
            </div>
            <div>
              <p className="text-xs text-slate-400">روزهای پیاپی</p>
              <p className="text-lg font-black">۳ روز</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm col-span-1 md:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            روند امتیازات اخیر
          </h3>
          <div className="h-64">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">داده‌ای برای نمایش وجود ندارد.</div>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium">سطح شناختی فعلی</p>
            <h4 className="text-6xl font-black mt-2">{user.level}</h4>
          </div>
          
          <div className="relative z-10 space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 opacity-80">
                <span>پیشرفت تا سطح {user.level + 1}</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              {progressPercent >= 100 
                ? 'شما آماده ارتقا هستید! در آزمون بعدی شرکت کنید.' 
                : `با گذراندن ${Math.max(0, 3 - currentLevelAttempts)} آزمون دیگر با نمره بالا، به سطح بعدی می‌رسید.`}
            </p>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm border-r-4 border-r-indigo-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <h3 className="text-xl font-bold">تحلیل هوشمند سامانه (Gemini AI)</h3>
        </div>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-loose italic whitespace-pre-wrap">
            "{insight}"
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">آخرین فعالیت‌ها</h3>
        <div className="grid grid-cols-1 gap-4">
          {userAttempts.length > 0 ? userAttempts.slice(-3).reverse().map(a => (
            <div key={a.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl">📝</div>
                <div>
                  <p className="font-bold">آزمون کد {a.examId.substr(0,5)}</p>
                  <p className="text-xs text-slate-400">{new Date(a.date).toLocaleDateString('fa-IR')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-indigo-600">{a.score} / ۱۰۰</p>
                <p className="text-xs text-green-500 font-bold">تکمیل شده</p>
              </div>
            </div>
          )) : (
            <div className="text-center p-10 bg-slate-50 rounded-2xl text-slate-400">هنوز آزمونی ثبت نشده است.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
