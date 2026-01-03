
import React, { useState } from 'react';
import { Attempt, SystemAlert } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminPanelProps {
  attempts: Attempt[];
  onAddAlert: (alert: SystemAlert) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ attempts, onAddAlert }) => {
  const [newAlert, setNewAlert] = useState({ title: '', message: '', severity: 'medium' as any });
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'شهروندان فعال', value: '۱,۴۸۲', trend: '+۸٪', color: 'indigo' },
    { label: 'ضریب سواد شناختی', value: '۶۴٪', trend: '+۵٪', color: 'emerald' },
    { label: 'هشدارها (ماه جاری)', value: '۱۲', trend: '-۲٪', color: 'orange' },
    { label: 'محتواهای مدیریتی', value: '۴۵', trend: '۰٪', color: 'blue' },
  ];

  const levelData = [
    { name: 'مبتدی (۱-۳)', value: 45 },
    { name: 'متوسط (۴-۶)', value: 30 },
    { name: 'پیشرفته (۷-۹)', value: 20 },
    { name: 'نخبه (۱۰)', value: 5 },
  ];

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  const handleSendAlert = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAlert({
      ...newAlert,
      id: Math.random().toString(),
      date: new Date().toISOString()
    });
    setNewAlert({ title: '', message: '', severity: 'medium' });
    setShowModal(false);
  };

  return (
    <div className="space-y-10 pb-20 animate-in slide-in-from-left-5 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-4xl font-black text-slate-900">داشبورد پایش راهبردی</h2>
          <p className="text-slate-500 mt-2 font-medium">پایگاه مدیریت و تحلیل تهدیدات شناختی منطقه شهری</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-red-100 hover:scale-105 transition-transform flex items-center gap-3"
        >
          <span className="text-xl">⚠️</span>
          ارسال هشدار فوری
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-slate-900">{stat.value}</p>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-10">توزیع سواد شناختی شهروندان</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={levelData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {levelData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
             {levelData.map((d, i) => (
               <div key={d.name} className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i] }}></div>
                  <span className="text-xs font-black text-slate-600">{d.name}: {d.value}%</span>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xl font-black mb-10">تحلیل اثربخشی آموزش‌های تطبیقی</h3>
          <div className="space-y-8">
             {[
               { name: 'سناریوهای مقابله با شایعه', impact: 88, color: 'indigo' },
               { name: 'آموزش تفکر انتقادی مدیران', impact: 72, color: 'emerald' },
               { name: 'تحلیل رسانه‌های معاند', impact: 65, color: 'orange' },
             ].map(item => (
               <div key={item.name} className="space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="text-indigo-600">{item.impact}% بهبود</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${item.impact}%` }}
                    ></div>
                  </div>
               </div>
             ))}
          </div>
          <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
             <p className="text-xs text-indigo-700 font-medium leading-loose">
               <span className="font-black">تحلیل سیستم:</span> سناریوهای تعاملی ۸۵٪ بیشتر از متون تئوری در ارتقای سطح سواد شناختی مدیران شهری موثر بوده‌اند.
             </p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSendAlert} className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-10 space-y-6 animate-in zoom-in-95">
            <h3 className="text-2xl font-black">انتشار هشدار مدیریت شناختی</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black mb-2 px-2">عنوان هشدار</label>
                <input required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 ring-red-50" value={newAlert.title} onChange={e => setNewAlert({...newAlert, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 px-2">متن پیام (تحلیل تهدید)</label>
                <textarea required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none h-32" value={newAlert.message} onChange={e => setNewAlert({...newAlert, message: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-black mb-2 px-2">سطح حساسیت</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none" value={newAlert.severity} onChange={e => setNewAlert({...newAlert, severity: e.target.value as any})}>
                  <option value="low">کم (اطلاع‌رسانی عمومی)</option>
                  <option value="medium">متوسط (نیاز به دقت بیشتر)</option>
                  <option value="high">بسیار بالا (تهدید فوری)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-lg">انتشار سراسری</button>
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black text-lg">انصراف</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
