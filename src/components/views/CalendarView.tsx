import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  X,
  MapPin
} from 'lucide-react';
import { DayOfWeek, Task, TimetableClass } from '../../types';

interface CalendarViewProps {
  tasks: Task[];
  timetable: TimetableClass[];
  onOpenTaskModalWithDate: (dateStr: string) => void;
  onToggleTask: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  timetable,
  onOpenTaskModalWithDate,
  onToggleTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Calendar math
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Day mapping for classes (0 is Sunday: 'sun', 1 is Monday: 'mon', etc.)
  const dayKeys: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  // Days array
  const calendarCells = [];
  // Prev month padding
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      dayNum: daysInPrevMonth - i,
      dateStr: '',
      isCurrentMonth: false,
    });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    calendarCells.push({
      dayNum: d,
      dateStr: `${year}-${mStr}-${dStr}`,
      isCurrentMonth: true,
    });
  }
  // Next month padding to fill grid
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({
      dayNum: i,
      dateStr: '',
      isCurrentMonth: false,
    });
  }

  // Selected date details
  const selectedDateObj = new Date(selectedDateStr + 'T12:00:00');
  const selectedDayKey = dayKeys[selectedDateObj.getDay()];
  const tasksOnSelectedDate = tasks.filter((t) => t.dueDate === selectedDateStr);
  const classesOnSelectedDate = timetable.filter((c) => c.day === selectedDayKey);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track assignment deadlines, exam dates, and scheduled lectures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Today
          </button>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 bg-white dark:bg-slate-800">
            <button
              onClick={prevMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[130px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Day of week labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-xs font-bold uppercase text-slate-400 py-1 font-mono">
                {d}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {calendarCells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div
                    key={idx}
                    className="min-h-[75px] sm:min-h-[90px] p-1.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-700 text-xs font-mono select-none"
                  >
                    {cell.dayNum}
                  </div>
                );
              }

              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;
              const cellTasks = tasks.filter((t) => t.dueDate === cell.dateStr);

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 shadow-xs'
                      : isToday
                      ? 'border-amber-400 dark:border-amber-600 bg-amber-50/20 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : isSelected
                          ? 'text-blue-600 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cell.dayNum}
                    </span>
                    {cellTasks.length > 0 && (
                      <span className="text-[10px] font-mono px-1 rounded bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold">
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Task preview pills */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {cellTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] truncate px-1 py-0.5 rounded leading-tight font-medium ${
                          t.completed
                            ? 'line-through text-slate-400 bg-slate-100 dark:bg-slate-800'
                            : t.priority === 'high'
                            ? 'bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300'
                            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {cellTasks.length > 2 && (
                      <span className="text-[9px] text-slate-400 block text-right font-mono">
                        +{cellTasks.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector Sidebar (4 cols) */}
        <div className="lg:col-span-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Selected Day
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {new Intl.DateTimeFormat('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }).format(selectedDateObj)}
              </h3>
            </div>

            <button
              onClick={() => onOpenTaskModalWithDate(selectedDateStr)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Due Tasks on this Date */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>Deadlines Due Today</span>
              <span className="font-mono">{tasksOnSelectedDate.length}</span>
            </div>

            {tasksOnSelectedDate.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No assignments or tasks due on this date.
              </p>
            ) : (
              <div className="space-y-2">
                {tasksOnSelectedDate.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <button
                        onClick={() => onToggleTask(t.id)}
                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <span className={`text-xs font-semibold block truncate ${
                          t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                        }`}>
                          {t.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.subject} · {t.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Classes on this Day */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>Scheduled Classes ({selectedDayKey.toUpperCase()})</span>
              <span className="font-mono">{classesOnSelectedDate.length}</span>
            </div>

            {classesOnSelectedDate.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No classes scheduled for {selectedDayKey.toUpperCase()}.
              </p>
            ) : (
              <div className="space-y-2">
                {classesOnSelectedDate.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {c.code}: {c.subject}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.room} {c.instructor && `· ${c.instructor}`}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {c.startTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
