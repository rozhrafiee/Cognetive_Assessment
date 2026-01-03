
import React from 'react';
import { Attempt } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminPanelProps {
  attempts: Attempt[];
}

const AdminPanel: React.FC<AdminPanelProps> = ({ attempts }) => {
  const stats = [
    { label: 'کل کاربران', value: '۱۲۸', trend: '+۵٪', color: 'indigo' },
    { label: 'آزمون‌های انجام شده', value: attempts.length.toString(), trend: '+۱۲٪', color: 'emerald' },
    { label: 'میانگین نمرات', value: '۷۶.۴', trend: '-۲٪', color: 'orange' },
    { label: 'محتواهای فعال', value: '۲۴', trend: '۰٪', color: 'blue' },
  ];

  const levelData = [
    { name: 'سطح ۱', value: 45 },
    { name: 'سطح ۲', value: 30 },
    { name: 'سطح ۳', value: 20 },
    { name: 'سطح ۴+', value: 5 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-slate-900">پنل مدیریت سامانه</h2>
        <p className="text-slate-500 mt-2">نظارت بر فعالیت کاربران و تحلیل روندهای کلی سامانه.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-slate-800">{stat.value}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold mb-8">توزیع سطوح کاربران</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             {levelData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-sm font-medium text-slate-600">{d.name}: {d.value}%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-8">عملکرد اخیر اساتید</h3>
          <div className="space-y-6">
             {[
               { name: 'دکتر علوی', tests: 45, rating: 4.8 },
               { name: 'استاد رضایی', tests: 32, rating: 4.5 },
               { name: 'دکتر کریمی', tests: 28, rating: 4.9 },
             ].map(teacher => (
               <div key={teacher.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold">{teacher.name.charAt(0)}</div>
                     <div>
                        <p className="font-bold">{teacher.name}</p>
                        <p className="text-xs text-slate-400">{teacher.tests} آزمون تصحیح شده</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="text-sm font-bold text-orange-500">⭐ {teacher.rating}</div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
