import React from 'react';
import { 
  CheckSquare, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Play, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Timer,
  AlertCircle
} from 'lucide-react';
import { ActiveTab, DayOfWeek, FocusSession, Note, Task, TimetableClass, UserSettings } from '../../types';

interface DashboardViewProps {
  tasks: Task[];
  timetable: TimetableClass[];
  notes: Note[];
  sessions: FocusSession[];
  settings: UserSettings;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTaskModal: () => void;
  onOpenNoteModal: () => void;
  onToggleTask: (id: string) => void;
  onStartFocusForTask: (task: Task) => void;
  timerRunning: boolean;
  timerFormatted: string;
  onToggleTimer: () => void;
}

const STUDY_TIPS = [
  "Spaced repetition beats cramming: reviewing material after 1, 3, and 7 days strengthens long-term neural recall.",
  "The Feynman Technique: if you can't explain a concept in simple terms to a beginner, you have gaps in your understanding.",
  "Chunking principle: break 3-hour study blocks into 25-minute sprints with 5-minute pauses to prevent cognitive fatigue.",
  "Active recall: test yourself with flashcards or practice questions instead of passively re-reading textbooks.",
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  timetable,
  notes,
  sessions,
  settings,
  setActiveTab,
  onOpenTaskModal,
  onOpenNoteModal,
  onToggleTask,
  onStartFocusForTask,
  timerRunning,
  timerFormatted,
  onToggleTimer,
}) => {
  const now = new Date();
  const dayNames: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const currentDay = dayNames[now.getDay()];

  // Today's classes sorted by start time
  const todaysClasses = timetable
    .filter((c) => c.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Today's focus minutes
  const todayStr = now.toISOString().split('T')[0];
  const todaySessions = sessions.filter(
    (s) => s.type === 'focus' && s.completedAt.startsWith(todayStr)
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Active / pending tasks
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Urgent pending tasks (high priority or due soon)
  const urgentTasks = [...pendingTasks]
    .sort((a, b) => {
      const pOrder = { high: 0, medium: 1, low: 2 };
      if (pOrder[a.priority] !== pOrder[b.priority]) {
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 4);

  // Next deadline
  const nextDeadlineTask = [...pendingTasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];

  // Daily goal calculation
  const targetMinutes = (settings.dailyGoalHours || 4) * 60;
  const goalPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

  // Past 7 days study minutes for mini chart
  const past7DaysData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dStr = d.toISOString().split('T')[0];
    const mins = sessions
      .filter((s) => s.type === 'focus' && s.completedAt.startsWith(dStr))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      date: dStr,
      hours: +(mins / 60).toFixed(1),
      minutes: mins,
    };
  });

  const maxMins = Math.max(...past7DaysData.map((d) => d.minutes), 60);

  // Today's greeting
  const getGreeting = () => {
    const hr = now.getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentTip = STUDY_TIPS[now.getDate() % STUDY_TIPS.length];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Hero Banner with Desk Image */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span>{settings.studentSchool || 'University Campus'}</span>
              <span>·</span>
              <span>{settings.studentMajor || 'Student'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white text-balance">
              {getGreeting()}, {settings.studentName.split(' ')[0]}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              You have <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{pendingTasks.length} pending tasks</span> and <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{todaysClasses.length} scheduled classes</span> today. Let's make today productive!
            </p>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onOpenTaskModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>

              <button
                onClick={() => setActiveTab('timer')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Timer className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Focus Session</span>
              </button>

              <button
                onClick={onOpenNoteModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Quick Note</span>
              </button>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="hidden lg:block lg:col-span-4 relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-44 shadow-xs">
            <img
              src="/src/assets/images/student_study_desk_1794389949778.jpg"
              alt="Study desk workspace"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-3.5">
              <div className="text-white">
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-300 block">Daily Motivation</span>
                <p className="text-xs italic text-slate-200 line-clamp-2">
                  "{currentTip}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Focus Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Focus Time Today
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {Math.floor(todayMinutes / 60)}h {todayMinutes % 60}m
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              / {settings.dailyGoalHours}h goal
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: Task Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task Progress
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {completedTasks.length} / {totalTasks}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono">
              {completionRate}% completed
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Next Deadline */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Next Deadline
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          {nextDeadlineTask ? (
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {nextDeadlineTask.title}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 font-medium mt-1">
                <span>{nextDeadlineTask.subject}</span>
                <span>·</span>
                <span className="font-mono">{nextDeadlineTask.dueDate}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No upcoming deadlines</p>
          )}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{pendingTasks.length} pending total</span>
            <button 
              onClick={() => setActiveTab('tasks')} 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all
            </button>
          </div>
        </div>

        {/* Card 4: Study Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Study Streak
            </span>
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              5 Days
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Consistency level: High
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                  idx < 5 
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200' 
                    : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Today's Classes + Priority Task Queue */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Today's Schedule */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Today's Timetable ({currentDay.toUpperCase()})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('planner')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysClasses.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No classes scheduled for today. Enjoy your self-directed study!
              </div>
            ) : (
              <div className="space-y-3">
                {todaysClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-2.5 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: cls.color || '#3B82F6' }}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                            {cls.code}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {cls.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{cls.room}</span>
                          {cls.instructor && (
                            <>
                              <span>·</span>
                              <span>{cls.instructor}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block">
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Priority Tasks Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Priority Tasks
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('tasks')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>View All Tasks ({pendingTasks.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                All priority tasks completed! Great work.
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-blue-500 transition-colors shrink-0"
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                      </button>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 block truncate">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{task.subject}</span>
                          <span>·</span>
                          <span className={`capitalize ${
                            task.priority === 'high' ? 'text-red-500 font-semibold' : ''
                          }`}>
                            {task.priority} priority
                          </span>
                          <span>·</span>
                          <span className="font-mono">Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onStartFocusForTask(task)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors shrink-0"
                      title="Focus on this task in Pomodoro timer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Focus</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Pomodoro Widget & 7-Day Chart Preview */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Focus Widget */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50/80 to-white dark:from-slate-800/80 dark:to-slate-900 border border-blue-100 dark:border-slate-800 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
              Pomodoro Focus Session
            </span>
            <div className="my-4">
              <span className="text-4xl sm:text-5xl font-mono font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">
                {timerFormatted}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onToggleTimer}
                className={`px-5 py-2.5 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 ${
                  timerRunning
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{timerRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => setActiveTab('timer')}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
              >
                Timer Settings
              </button>
            </div>
          </div>

          {/* Past 7 Days Study Hours Mini Chart */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Weekly Study Activity
              </h3>
              <button
                onClick={() => setActiveTab('analytics')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Analytics
              </button>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 pt-4">
              {past7DaysData.map((d, i) => {
                const heightPercent = Math.max(8, Math.round((d.minutes / maxMins) * 100));
                const isToday = i === 6;
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.hours}h
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t h-24 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          isToday ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-400'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono font-medium ${
                      isToday ? 'text-blue-600 font-bold' : 'text-slate-400'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Pinned Notes Preview */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Recent Study Notes
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Notes ({notes.length})
              </button>
            </div>

            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveTab('notes')}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                    {note.title}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{note.subject}</span>
                    <span>·</span>
                    <span>{note.tags[0] ? `#${note.tags[0]}` : 'General'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
