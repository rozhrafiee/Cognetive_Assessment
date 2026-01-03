
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({ name: user.name, email: user.email });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = () => {
    onUpdateUser({ ...user, ...formData });
    setIsEditing(false);
    setMessage('تغییرات با موفقیت ذخیره شد.');
    setTimeout(() => setMessage(''), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    const roles = {
      [UserRole.CITIZEN]: { label: 'شهروند', color: 'bg-green-100 text-green-700' },
      [UserRole.TEACHER]: { label: 'استاد', color: 'bg-blue-100 text-blue-700' },
      [UserRole.ADMIN]: { label: 'مدیر سیستم', color: 'bg-purple-100 text-purple-700' },
    };
    return roles[role];
  };

  const badge = getRoleBadge(user.role);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-32 h-32 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center text-4xl text-white font-black transform rotate-3">
            <span className="-rotate-3">{user.name.charAt(0)}</span>
          </div>
          
          <div className="flex-1 text-center md:text-right space-y-2">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
              <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-slate-500 font-medium">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">سطح فعلی</p>
                <p className="text-lg font-black text-indigo-600">{user.level}</p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase">امتیاز تجربه (XP)</p>
                <p className="text-lg font-black text-purple-600">{user.xp.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            {isEditing ? 'انصراف' : 'ویرایش پروفایل'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="text-2xl">📝</span> اطلاعات کاربری
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">نام کامل</label>
                <input 
                  disabled={!isEditing}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all disabled:opacity-60"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-1">آدرس ایمیل</label>
                <input 
                  disabled={!isEditing}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 ring-indigo-50 transition-all disabled:opacity-60"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-100 mt-4"
                >
                  ذخیره تغییرات
                </button>
              )}
              {message && <p className="text-green-600 font-bold text-center animate-pulse">{message}</p>}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black mb-6">تاریخچه فعالیت‌ها</h3>
            <div className="space-y-4">
              {user.scoreHistory.length > 0 ? user.scoreHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">🏆</div>
                      <div>
                        <p className="text-sm font-bold">شرکت در آزمون {h.contentId}</p>
                        <p className="text-[10px] text-slate-400">{new Date(h.date).toLocaleDateString('fa-IR')}</p>
                      </div>
                   </div>
                   <span className="text-indigo-600 font-black">{h.score}%</span>
                </div>
              )) : (
                <p className="text-center text-slate-400 py-6 italic">هنوز سابقه‌ای ثبت نشده است.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-black mb-2">توصیه شناختی</h3>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                بر اساس سطح {user.level} شما، سیستم پیشنهاد می‌کند سناریوهای "تفکر نقادانه" را در اولویت قرار دهید تا XP بیشتری کسب کنید.
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-xs text-indigo-200 font-bold uppercase tracking-widest mb-1">XP تا سطح بعدی</p>
              <p className="text-3xl font-black">{(1000 - (user.xp % 1000))} امتیاز</p>
              <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${(user.xp % 1000) / 10}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
