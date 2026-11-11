import React from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  SlidersHorizontal, 
  Github, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  GraduationCap
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenGithubGuide: () => void;
  timerRunning: boolean;
  timerFormatted: string;
  onToggleTimer: () => void;
  settings: UserSettings;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
  onOpenSearch,
  onOpenSettings,
  onOpenGithubGuide,
  timerRunning,
  timerFormatted,
  onToggleTimer,
  settings,
  onToggleSound,
}) => {
  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const getBreadcrumbTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Overview';
      case 'tasks': return 'Tasks & Assignments';
      case 'planner': return 'Weekly Timetable';
      case 'timer': return 'Pomodoro Focus Timer';
      case 'notes': return 'Study Notes';
      case 'calendar': return 'Monthly Calendar';
      case 'analytics': return 'Productivity Analytics';
      default: return 'StudentHub';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand title & Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-blue-700 transition-colors">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-none">
              StudentHub
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline-block">
              {getBreadcrumbTitle(activeTab)}
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: Search shortcut bar */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          title="Search tasks, notes, courses (Ctrl+K)"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">Search tasks, notes, courses...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Quick timer status + Theme toggle + GitHub & Settings */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Floating Mini Timer Trigger */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
          <button
            onClick={() => setActiveTab('timer')}
            className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Open Pomodoro Timer"
          >
            {timerFormatted}
          </button>
          <button
            onClick={onToggleTimer}
            className={`p-1 rounded text-white ${
              timerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
            title={timerRunning ? 'Pause Timer' : 'Start Timer'}
          >
            {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        </div>

        {/* Sound mute toggle */}
        <button
          onClick={onToggleSound}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={settings.soundEnabled ? 'Mute Chimes & Sounds' : 'Unmute Sounds'}
          aria-label="Sound toggle"
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Theme toggle"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* GitHub Pages Deploy Guide */}
        <button
          onClick={onOpenGithubGuide}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          title="GitHub Pages Deployment Guide"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">Deploy Guide</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Preferences & Backup Data"
          aria-label="Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Date readout */}
        <span className="hidden xl:inline-block text-xs font-medium text-slate-500 dark:text-slate-400 pl-1 border-l border-slate-200 dark:border-slate-800 whitespace-nowrap">
          {todayStr}
        </span>
      </div>
    </header>
  );
};
