
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.CITIZEN);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const usersJson = localStorage.getItem('cogni_users_db');
    const users: (User & { password?: string })[] = usersJson ? JSON.parse(usersJson) : [];

    if (isLogin) {
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        setError('ایمیل یا رمز عبور اشتباه است.');
      }
    } else {
      if (users.find(u => u.email === formData.email)) {
        setError('این ایمیل قبلاً ثبت شده است.');
        return;
      }
      
      const newUser: User & { password?: string } = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        level: role === UserRole.CITIZEN ? 0 : 5,
        scoreHistory: []
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem('cogni_users_db', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-in fade-in zoom-in duration-500">
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-xl shadow-indigo-100 animate-bounce">
            🧠
          </div>
          <h1 className="text-3xl font-black text-slate-900">سنجش شناختی</h1>
          <p className="text-slate-500 mt-2">{isLogin ? 'خوش آمدید، لطفا وارد شوید' : 'حساب کاربری جدید بسازید'}</p>
        </div>

        <div className="px-10 pb-4">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              ورود
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              ثبت‌نام
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 px-2">نام و نام خانوادگی</label>
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all"
                  placeholder=""
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-2">ایمیل</label>
              <input 
                required
                type="email"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all"
                placeholder=""
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-2">رمز عبور</label>
              <input 
                required
                type="password"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 ring-indigo-50 focus:bg-white transition-all"
                placeholder=""
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 px-2">نقش کاربری</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: UserRole.CITIZEN, label: 'شهروند' },
                    { id: UserRole.TEACHER, label: 'استاد' },
                    { id: UserRole.ADMIN, label: 'ادمین' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all ${role === r.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-xs font-bold px-2 animate-pulse">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95 mt-6"
            >
              {isLogin ? 'ورود به حساب' : 'ایجاد حساب کاربری'}
            </button>
          </form>
        </div>

        <div className="p-8 bg-slate-50 text-center text-xs text-slate-400">
          با ورود به سامانه، تمامی قوانین سنجش شناختی را می‌پذیرید.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
