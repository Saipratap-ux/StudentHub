import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ActiveTab, 
  DayOfWeek, 
  FocusSession, 
  Note, 
  Task, 
  TimetableClass, 
  UserSettings 
} from './types';
import { 
  loadTasks, 
  saveTasks, 
  loadTimetable, 
  saveTimetable, 
  loadNotes, 
  saveNotes, 
  loadSessions, 
  saveSessions, 
  loadSettings, 
  saveSettings,
  exportAllDataAsJSON,
  importAllDataFromJSON,
  resetAllDataToDefault,
  clearAllData
} from './utils/storage';
import { 
  playCompletionChime, 
  playSoftTap, 
  startAmbientSound, 
  stopAmbientSound 
} from './utils/audio';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { PlannerView } from './components/views/PlannerView';
import { TimerView } from './components/views/TimerView';
import { NotesView } from './components/views/NotesView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';

import { TaskModal } from './components/modals/TaskModal';
import { ClassModal } from './components/modals/ClassModal';
import { NoteModal } from './components/modals/NoteModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { GitHubGuideModal } from './components/modals/GitHubGuideModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Menu } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('studenthub_darkmode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('studenthub_darkmode', String(darkMode));
  }, [darkMode]);

  // Core Data
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [timetable, setTimetable] = useState<TimetableClass[]>(() => loadTimetable());
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadSessions());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());

  // Save changes to LocalStorage
  useEffect(() => { saveTasks(tasks); }, [tasks]);
  useEffect(() => { saveTimetable(timetable); }, [timetable]);
  useEffect(() => { saveNotes(notes); }, [notes]);
  useEffect(() => { saveSessions(sessions); }, [sessions]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TimetableClass | null>(null);
  const [classModalDefaultDay, setClassModalDefaultDay] = useState<DayOfWeek>('mon');

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGithubGuideOpen, setIsGithubGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Pomodoro Timer State
  const [timerMode, setTimerMode] = useState<'focus' | 'short_break' | 'long_break'>('focus');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState((settings.focusDuration || 25) * 60);
  const [totalTime, setTotalTime] = useState((settings.focusDuration || 25) * 60);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [activeSubject, setActiveSubject] = useState('');
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'cafebuzz'>('none');

  // Sync timer duration if settings change and timer is reset
  useEffect(() => {
    if (!timerRunning) {
      let durationMins = settings.focusDuration || 25;
      if (timerMode === 'short_break') durationMins = settings.shortBreakDuration || 5;
      if (timerMode === 'long_break') durationMins = settings.longBreakDuration || 15;
      setTimeLeft(durationMins * 60);
      setTotalTime(durationMins * 60);
    }
  }, [timerMode, settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  // Pomodoro Ticker
  useEffect(() => {
    let interval: number | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      // Session finished!
      setTimerRunning(false);
      if (settings.soundEnabled) {
        playCompletionChime();
      }
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });

      // If focus sprint finished, record session!
      if (timerMode === 'focus') {
        const finishedTask = tasks.find((t) => t.id === selectedTaskId);
        const newSession: FocusSession = {
          id: `sess-${Date.now()}`,
          taskId: selectedTaskId || undefined,
          taskTitle: finishedTask?.title || undefined,
          subject: activeSubject || finishedTask?.subject || 'General Study',
          durationMinutes: Math.round(totalTime / 60),
          completedAt: new Date().toISOString(),
          type: 'focus',
        };
        setSessions((prev) => [newSession, ...prev]);

        // Auto switch to break if configured
        if (settings.autoStartBreaks) {
          setTimerMode('short_break');
          setTimerRunning(true);
        }
      } else {
        // Break finished
        setTimerMode('focus');
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, timerMode, totalTime, selectedTaskId, activeSubject, tasks, settings]);

  // Ambient sound controller
  const handleSelectAmbientSound = (sound: 'none' | 'rain' | 'whitenoise' | 'cafebuzz') => {
    setAmbientSound(sound);
    if (sound === 'none') {
      stopAmbientSound();
    } else {
      startAmbientSound(sound);
    }
  };

  const toggleSound = () => {
    const next = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: next }));
    if (!next) {
      stopAmbientSound();
      setAmbientSound('none');
    }
  };

  const handleToggleTimer = () => {
    if (settings.soundEnabled) {
      playSoftTap();
    }
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    let durationMins = settings.focusDuration || 25;
    if (timerMode === 'short_break') durationMins = settings.shortBreakDuration || 5;
    if (timerMode === 'long_break') durationMins = settings.longBreakDuration || 15;
    setTimeLeft(durationMins * 60);
    setTotalTime(durationMins * 60);
  };

  const handleSkipTimer = () => {
    setTimerRunning(false);
    if (timerMode === 'focus') {
      setTimerMode('short_break');
    } else {
      setTimerMode('focus');
    }
  };

  const timerMinutes = Math.floor(timeLeft / 60);
  const timerSecs = timeLeft % 60;
  const timerFormatted = `${String(timerMinutes).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Actions
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>, taskId?: string) => {
    if (taskId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, ...taskData } : t))
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleClearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleStartFocusForTask = (task: Task) => {
    setSelectedTaskId(task.id);
    setActiveSubject(task.subject);
    setActiveTab('timer');
    if (!timerRunning) {
      setTimerMode('focus');
      setTimerRunning(true);
      if (settings.soundEnabled) playSoftTap();
    }
  };

  // Class Actions
  const handleSaveClass = (classData: Omit<TimetableClass, 'id'>, classId?: string) => {
    if (classId) {
      setTimetable((prev) =>
        prev.map((c) => (c.id === classId ? { ...c, ...classData } : c))
      );
    } else {
      const newClass: TimetableClass = {
        ...classData,
        id: `class-${Date.now()}`,
      };
      setTimetable((prev) => [...prev, newClass]);
    }
  };

  const handleDeleteClass = (id: string) => {
    setTimetable((prev) => prev.filter((c) => c.id !== id));
  };

  // Note Actions
  const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>, noteId?: string) => {
    const nowISO = new Date().toISOString();
    if (noteId) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, ...noteData, updatedAt: nowISO } : n))
      );
    } else {
      const newNote: Note = {
        ...noteData,
        id: `note-${Date.now()}`,
        createdAt: nowISO,
        updatedAt: nowISO,
      };
      setNotes((prev) => [newNote, ...prev]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleTogglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  // Data Persistence Backups
  const handleExportData = () => {
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studenthub_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string): boolean => {
    const success = importAllDataFromJSON(jsonStr);
    if (success) {
      setTasks(loadTasks());
      setTimetable(loadTimetable());
      setNotes(loadNotes());
      setSessions(loadSessions());
      setSettings(loadSettings());
    }
    return success;
  };

  const handleResetData = () => {
    resetAllDataToDefault();
    setTasks(loadTasks());
    setTimetable(loadTimetable());
    setNotes(loadNotes());
    setSessions(loadSessions());
    setSettings(loadSettings());
  };

  const handleClearData = () => {
    clearAllData();
    setTasks([]);
    setTimetable([]);
    setNotes([]);
    setSessions([]);
  };

  // Distinct subjects for modals
  const existingSubjects = Array.from(
    new Set([
      ...tasks.map((t) => t.subject),
      ...timetable.map((c) => c.subject),
      ...notes.map((n) => n.subject),
    ])
  ).filter(Boolean);

  // Today study minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompletedSessions = sessions.filter(
    (s) => s.type === 'focus' && s.completedAt.startsWith(todayStr)
  );
  const todayStudyMinutes = todayCompletedSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGithubGuide={() => setIsGithubGuideOpen(true)}
        timerRunning={timerRunning}
        timerFormatted={timerFormatted}
        onToggleTimer={handleToggleTimer}
        settings={settings}
        onToggleSound={toggleSound}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTasksCount={tasks.filter((t) => !t.completed).length}
          streakDays={5}
          todayStudyMinutes={todayStudyMinutes}
          settings={settings}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGithubGuide={() => setIsGithubGuideOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Mobile open drawer trigger button */}
          <div className="md:hidden mb-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xs"
            >
              <Menu className="w-4 h-4" />
              <span>Menu</span>
            </button>
            <span className="text-xs font-semibold uppercase text-slate-400">
              {activeTab}
            </span>
          </div>

          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              timetable={timetable}
              notes={notes}
              sessions={sessions}
              settings={settings}
              setActiveTab={setActiveTab}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onOpenNoteModal={() => {
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }}
              onToggleTask={handleToggleTask}
              onStartFocusForTask={handleStartFocusForTask}
              timerRunning={timerRunning}
              timerFormatted={timerFormatted}
              onToggleTimer={handleToggleTimer}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              onClearCompleted={handleClearCompletedTasks}
              onStartFocusForTask={handleStartFocusForTask}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              timetable={timetable}
              onOpenClassModal={(day) => {
                setEditingClass(null);
                setClassModalDefaultDay(day || 'mon');
                setIsClassModalOpen(true);
              }}
              onEditClass={(cls) => {
                setEditingClass(cls);
                setIsClassModalOpen(true);
              }}
              onDeleteClass={handleDeleteClass}
            />
          )}

          {activeTab === 'timer' && (
            <TimerView
              timerMode={timerMode}
              setTimerMode={setTimerMode}
              timeLeft={timeLeft}
              totalTime={totalTime}
              isRunning={timerRunning}
              onToggleTimer={handleToggleTimer}
              onResetTimer={handleResetTimer}
              onSkipTimer={handleSkipTimer}
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              setSelectedTaskId={setSelectedTaskId}
              activeSubject={activeSubject}
              setActiveSubject={setActiveSubject}
              completedTodaySessions={todayCompletedSessions}
              settings={settings}
              ambientSound={ambientSound}
              onSelectAmbientSound={handleSelectAmbientSound}
            />
          )}

          {activeTab === 'notes' && (
            <NotesView
              notes={notes}
              onOpenNoteModal={() => {
                setEditingNote(null);
                setIsNoteModalOpen(true);
              }}
              onEditNote={(note) => {
                setEditingNote(note);
                setIsNoteModalOpen(true);
              }}
              onDeleteNote={handleDeleteNote}
              onTogglePin={handleTogglePinNote}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              tasks={tasks}
              timetable={timetable}
              onOpenTaskModalWithDate={(dateStr) => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              sessions={sessions}
              settings={settings}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={editingTask}
        existingSubjects={existingSubjects.length > 0 ? existingSubjects : ['Computer Science', 'Mathematics', 'Physics']}
      />

      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSave={handleSaveClass}
        editingClass={editingClass}
        defaultDay={classModalDefaultDay}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSave={handleSaveNote}
        editingNote={editingNote}
        existingSubjects={existingSubjects.length > 0 ? existingSubjects : ['Computer Science', 'Mathematics', 'Physics']}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        onClearData={handleClearData}
      />

      <GitHubGuideModal
        isOpen={isGithubGuideOpen}
        onClose={() => setIsGithubGuideOpen(false)}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tasks={tasks}
        notes={notes}
        timetable={timetable}
        onSelectResult={(tab) => setActiveTab(tab)}
      />

      {/* Offline Connectivity Notification */}
      <OfflineIndicator />
    </div>
  );
}
