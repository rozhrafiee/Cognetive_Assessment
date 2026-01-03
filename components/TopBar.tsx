
import React from 'react';
import { User, UserRole } from '../types';

interface TopBarProps {
  user: User;
  onRoleSwitch: (role: UserRole) => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onRoleSwitch }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      <div className="flex items-center gap-4">
        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {user.role}
        </span>
        <div className="h-4 w-px bg-slate-200 mx-2"></div>
        <select 
          onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
          className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 outline-none focus:ring-2 ring-indigo-200"
          value={user.role}
        >
          <option value={UserRole.CITIZEN}>تغییر به نقش شهروند</option>
          <option value={UserRole.TEACHER}>تغییر به نقش استاد</option>
          <option value={UserRole.ADMIN}>تغییر به نقش ادمین</option>
        </select>
      </div>

      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="text-left">
          <p className="text-sm font-bold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500">سطح شناختی: {user.level || 'تعیین نشده'}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white font-bold">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
