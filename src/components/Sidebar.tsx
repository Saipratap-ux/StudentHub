import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  CalendarRange, 
  Timer, 
  FileText, 
  Calendar, 
  BarChart3, 
  Github, 
  Settings,
  ChevronRight,
  Flame,
  X,
  GraduationCap
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
  streakDays: number;
  todayStudyMinutes: number;
  settings: UserSettings;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  onOpenGithubGuide: () => void;
  avatarUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  streakDays,
  todayStudyMinutes,
  settings,
  isOpenMobile,
  onCloseMobile,
  onOpenSettings,
  onOpenGithubGuide,
  avatarUrl = '/src/assets/images/student_avatar_1794389949948.jpg',
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Coursework', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'planner', label: 'Timetable Planner', icon: CalendarRange },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'calendar', label: 'Monthly Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const goalMinutes = (settings.dailyGoalHours || 4) * 60;
  const progressPercent = Math.min(100, Math.round((todayStudyMinutes / goalMinutes) * 100));

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block leading-none">
                  SAIPRATAP
                </span>
                <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
                  StudentHub
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Streak Pill */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between px-3 py-2 bg-purple-950/40 border border-purple-800/40 rounded-xl">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-400 fill-purple-400" />
                <span className="text-xs font-semibold text-purple-200">
                  {streakDays} Day Study Streak
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                Active
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/50">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Daily Target & User Profile */}
        <div className="p-3 border-t border-slate-800 space-y-3">
          {/* Mobile Install App Button */}
          <div className="md:hidden">
            <PWAInstallButton className="w-full justify-center" />
          </div>

          {/* Daily Goal Gauge */}
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-300">Daily Study Target</span>
              <span className="font-mono text-slate-400">
                {Math.floor(todayStudyMinutes / 60)}h {todayStudyMinutes % 60}m / {settings.dailyGoalHours}h
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* GitHub Pages Guide Link */}
          <button
            onClick={() => {
              onCloseMobile();
              onOpenGithubGuide();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-purple-400" />
              <span>GitHub Pages Guide</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* User profile card */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={avatarUrl}
                alt={settings.studentName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-purple-600/40 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {settings.studentName}
                </p>
                <p className="text-[11px] text-slate-400 truncate leading-tight">
                  {settings.studentMajor}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onCloseMobile();
                onOpenSettings();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Settings & Storage"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
