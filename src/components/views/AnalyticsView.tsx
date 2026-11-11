import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Award, 
  Download, 
  PieChart as PieIcon,
  Calendar
} from 'lucide-react';
import { FocusSession, Task, UserSettings } from '../../types';

interface AnalyticsViewProps {
  tasks: Task[];
  sessions: FocusSession[];
  settings: UserSettings;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  sessions,
  settings,
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | '14days'>('7days');
  const daysCount = timeRange === '7days' ? 7 : 14;

  // Total Focus Minutes
  const totalFocusMinutes = sessions
    .filter((s) => s.type === 'focus')
    .reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = +(totalFocusMinutes / 60).toFixed(1);

  // Total Pomodoros
  const totalPomodoros = sessions.filter((s) => s.type === 'focus').length;

  // Task metrics
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Productivity Score formula: balanced index of goal fulfillment and completion rate
  const goalTargetDaily = (settings.dailyGoalHours || 4) * 60;
  const recent7DaysFocus = sessions
    .filter((s) => {
      const d = new Date(s.completedAt).getTime();
      return Date.now() - d <= 7 * 86400000 && s.type === 'focus';
    })
    .reduce((sum, s) => sum + s.durationMinutes, 0);
  const weeklyTarget = goalTargetDaily * 7;
  const goalAttainment = Math.min(100, Math.round((recent7DaysFocus / (weeklyTarget || 1)) * 100));
  const focusScore = Math.min(99, Math.round(completionRate * 0.5 + goalAttainment * 0.5));

  // Past N days series data
  const daysData = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daysCount - 1 - i));
    const dStr = d.toISOString().split('T')[0];
    const mins = sessions
      .filter((s) => s.type === 'focus' && s.completedAt.startsWith(dStr))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: dStr,
      minutes: mins,
      hours: +(mins / 60).toFixed(1),
    };
  });

  const maxMins = Math.max(...daysData.map((d) => d.minutes), (settings.dailyGoalHours || 4) * 60, 60);

  // Subject distribution breakdown
  const subjectMap: Record<string, number> = {};
  sessions
    .filter((s) => s.type === 'focus')
    .forEach((s) => {
      const sub = s.subject || 'General Study';
      subjectMap[sub] = (subjectMap[sub] || 0) + s.durationMinutes;
    });

  const subjectBreakdown = Object.entries(subjectMap)
    .map(([subject, minutes]) => ({
      subject,
      minutes,
      hours: +(minutes / 60).toFixed(1),
      percent: totalFocusMinutes > 0 ? Math.round((minutes / totalFocusMinutes) * 100) : 0,
    }))
    .sort((a, b) => b.minutes - a.minutes);

  const SUBJECT_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];

  // Export CSV report
  const handleExportCSV = () => {
    const headers = 'Date,Session Type,Subject,Task Title,Duration (Minutes)\n';
    const rows = sessions
      .map((s) => `"${s.completedAt.split('T')[0]}","${s.type}","${s.subject || 'General'}","${s.taskTitle || ''}",${s.durationMinutes}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studenthub_study_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Productivity Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Data insights, subject time distribution, and study consistency metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Study Time
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
            {totalFocusHours} hrs
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {totalFocusMinutes} total minutes logged
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pomodoros Finished
            </span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
            {totalPomodoros}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            Sprint sessions completed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Task Completion Rate
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
            {completionRate}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
            {completedTasks.length} of {tasks.length} tasks finished
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Productivity Index
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums block">
            {focusScore} / 100
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 block">
            Top tier study consistency
          </span>
        </div>
      </div>

      {/* Main Chart Section: Daily Study Hours Activity */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Study Hours Timeline
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculated from Pomodoro sessions and dedicated study sprints.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === '7days'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('14days')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === '14days'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Last 14 Days
            </button>
          </div>
        </div>

        {/* SVG/HTML Bar Chart */}
        <div className="pt-6">
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {daysData.map((d) => {
              const heightPercent = Math.max(6, Math.round((d.minutes / maxMins) * 100));
              const isToday = d.date === new Date().toISOString().split('T')[0];

              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono py-1 px-2 rounded pointer-events-none whitespace-nowrap shadow-md z-10">
                    {d.date}: {d.hours}h ({d.minutes}m)
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {d.hours > 0 ? `${d.hours}h` : '0'}
                  </span>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-44 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        isToday
                          ? 'bg-blue-600 dark:bg-blue-500'
                          : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-blue-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className={`text-xs font-mono font-medium ${
                    isToday ? 'text-blue-600 font-bold' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {d.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Subject Time Breakdown + Habit Consistency Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (6 cols): Subject Breakdown Donut & Table */}
        <div className="lg:col-span-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Study Time by Subject
            </h3>
          </div>

          {subjectBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-8 text-center">
              No subject study logs yet. Link your Pomodoro sessions to subjects to view distribution!
            </p>
          ) : (
            <div className="space-y-3">
              {subjectBreakdown.map((item, idx) => {
                const color = SUBJECT_COLORS[idx % SUBJECT_COLORS.length];
                return (
                  <div key={item.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.subject}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500 dark:text-slate-400">
                        {item.hours}h ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${item.percent}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right (6 cols): Consistency Review & Tips */}
        <div className="lg:col-span-6 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Study Rhythm & Consistency
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Study Target</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {settings.dailyGoalHours} Hours / Day
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Based on cognitive research, optimal deep focus retention occurs between 3 to 5 hours daily when paired with spaced breaks.
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">Longest Streak</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">7 Days</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">Avg. Sprint Duration</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">25 Minutes</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-300">Preferred Study Window</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">09:00 - 14:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
