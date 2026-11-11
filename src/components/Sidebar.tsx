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
  X
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';

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
    { id: 'tasks', label: 'Tasks & To-Do', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'planner', label: 'Timetable', icon: CalendarRange },
    { id: 'timer', label: 'Focus Timer', icon: Timer },
    { id: 'notes', label: 'Study Notes', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
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
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                S
              </div>
              <div>
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-none">
                  StudentHub
                </span>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                  Study Life Workspace
                </span>
              </div>
            </div>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Streak Pill */}
          <div className="px-4 py-3">
            <div className="flex items-center justify-between px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 rounded-lg">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  {streakDays} Day Streak
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-700 dark:text-amber-300">
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
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Daily Target & User Profile */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Daily Goal Gauge */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-600 dark:text-slate-300">Daily Study Goal</span>
              <span className="font-mono text-slate-500 dark:text-slate-400">
                {Math.floor(todayStudyMinutes / 60)}h {todayStudyMinutes % 60}m / {settings.dailyGoalHours}h
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* GitHub Pages Guide Secondary Link */}
          <button
            onClick={() => {
              onCloseMobile();
              onOpenGithubGuide();
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-slate-500" />
              <span>GitHub Pages Guide</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User profile card */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={avatarUrl}
                alt={settings.studentName}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                  {settings.studentName}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate leading-tight">
                  {settings.studentMajor}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onCloseMobile();
                onOpenSettings();
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
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
