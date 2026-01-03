
import React from 'react';
import { User, UserRole } from '../types';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => {
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.CITIZEN: return 'شهروند';
      case UserRole.TEACHER: return 'استاد';
      case UserRole.ADMIN: return 'ادمین';
      default: return role;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-4">
        <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
          {getRoleLabel(user.role)}
        </span>
        <div className="h-4 w-px bg-slate-200 mx-2"></div>
        <button 
          onClick={onLogout}
          className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          خروج از حساب
        </button>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="text-left">
          <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
          <p className="text-[10px] text-slate-400 mt-1">سطح شناختی: {user.level || '۰'}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center text-white font-bold transform rotate-3">
          <span className="-rotate-3">{user.name.charAt(0)}</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
