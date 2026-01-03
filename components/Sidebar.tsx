
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  isBlocked: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role, isBlocked }) => {
  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊', roles: [UserRole.CITIZEN, UserRole.TEACHER, UserRole.ADMIN] },
    { id: 'profile', label: 'پروفایل من', icon: '👤', roles: [UserRole.CITIZEN, UserRole.TEACHER, UserRole.ADMIN] },
    { id: 'placement', label: 'تعیین سطح', icon: '🎯', roles: [UserRole.CITIZEN] },
    { id: 'library', label: 'کتابخانه محتوا', icon: '📚', roles: [UserRole.CITIZEN], disabled: isBlocked },
    { id: 'teacher', label: 'پنل استاد', icon: '👨‍🏫', roles: [UserRole.TEACHER] },
    { id: 'admin', label: 'پنل ادمین', icon: '🛠️', roles: [UserRole.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-l border-slate-200 hidden md:flex flex-col shadow-sm">
      <div className="p-6">
        <h1 className="text-xl font-black text-indigo-600 tracking-tight leading-tight">سنجش شناختی</h1>
        <p className="text-xs text-slate-400 mt-1">سامانه جامع شهروندی</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map(item => (
          <button
            key={item.id}
            disabled={item.disabled}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-700 font-bold shadow-sm' 
                : item.disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl text-white">
          <p className="text-xs font-medium opacity-80">وضعیت سامانه</p>
          <p className="text-sm font-bold">اتصال پایدار (هوشمند)</p>
          <div className="mt-3 bg-white/20 h-1.5 rounded-full overflow-hidden">
            <div className="bg-white w-full h-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
