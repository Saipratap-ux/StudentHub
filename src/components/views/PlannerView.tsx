import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Edit3, 
  Trash2, 
  Layers, 
  CalendarDays
} from 'lucide-react';
import { DayOfWeek, TimetableClass } from '../../types';

interface PlannerViewProps {
  timetable: TimetableClass[];
  onOpenClassModal: (day?: DayOfWeek) => void;
  onEditClass: (cls: TimetableClass) => void;
  onDeleteClass: (id: string) => void;
}

const DAYS: { key: DayOfWeek; label: string; fullLabel: string }[] = [
  { key: 'mon', label: 'Mon', fullLabel: 'Monday' },
  { key: 'tue', label: 'Tue', fullLabel: 'Tuesday' },
  { key: 'wed', label: 'Wed', fullLabel: 'Wednesday' },
  { key: 'thu', label: 'Thu', fullLabel: 'Thursday' },
  { key: 'fri', label: 'Fri', fullLabel: 'Friday' },
  { key: 'sat', label: 'Sat', fullLabel: 'Saturday' },
  { key: 'sun', label: 'Sun', fullLabel: 'Sunday' },
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  timetable,
  onOpenClassModal,
  onEditClass,
  onDeleteClass,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'day'>('grid');
  const now = new Date();
  const dayNames: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayKey = dayNames[now.getDay()];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayKey);

  // Calculate total class hours
  const totalClassesCount = timetable.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Study Planner & Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly schedule for lectures, recitations, labs, and dedicated study blocks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Weekly Grid</span>
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Day View</span>
            </button>
          </div>

          <button
            onClick={() => onOpenClassModal(selectedDay)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class / Block</span>
          </button>
        </div>
      </div>

      {/* Grid View Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-7 gap-4">
          {DAYS.map((day) => {
            const classesOnDay = timetable
              .filter((c) => c.day === day.key)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));
            const isToday = day.key === todayKey;

            return (
              <div
                key={day.key}
                className={`flex flex-col rounded-2xl border transition-colors ${
                  isToday
                    ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {day.label}
                    </span>
                    {isToday && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-blue-600 text-white">
                        TODAY
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onOpenClassModal(day.key)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                    title={`Add class on ${day.fullLabel}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Classes List */}
                <div className="p-2.5 flex-1 space-y-2.5 min-h-[160px]">
                  {classesOnDay.length === 0 ? (
                    <div className="h-full flex items-center justify-center py-8 text-center text-slate-400 text-xs">
                      No classes
                    </div>
                  ) : (
                    classesOnDay.map((cls) => (
                      <div
                        key={cls.id}
                        className="group relative p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-600"
                        style={{ borderLeftWidth: '4px', borderLeftColor: cls.color || '#3B82F6' }}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
                            {cls.code}
                          </span>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                            <button
                              onClick={() => onEditClass(cls)}
                              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onDeleteClass(cls.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">
                          {cls.subject}
                        </h4>

                        <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{cls.startTime} - {cls.endTime}</span>
                        </div>

                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{cls.room}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Day View Mode */
        <div className="space-y-4">
          {/* Day selection tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {DAYS.map((d) => (
              <button
                key={d.key}
                onClick={() => setSelectedDay(d.key)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                  selectedDay === d.key
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {d.fullLabel} {d.key === todayKey && '(Today)'}
              </button>
            ))}
          </div>

          {/* List of classes for selected day */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Schedule for {DAYS.find((d) => d.key === selectedDay)?.fullLabel}
              </h3>
              <button
                onClick={() => onOpenClassModal(selectedDay)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Class</span>
              </button>
            </div>

            {timetable.filter((c) => c.day === selectedDay).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No classes scheduled for {DAYS.find((d) => d.key === selectedDay)?.fullLabel}.
              </div>
            ) : (
              <div className="space-y-3">
                {timetable
                  .filter((c) => c.day === selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map((cls) => (
                    <div
                      key={cls.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div
                          className="w-3 h-12 rounded-full shrink-0"
                          style={{ backgroundColor: cls.color || '#3B82F6' }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                              {cls.code}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {cls.subject}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{cls.room}</span>
                            </span>
                            {cls.instructor && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                <span>{cls.instructor}</span>
                              </span>
                            )}
                          </div>
                          {cls.notes && (
                            <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">
                              {cls.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                          {cls.startTime} - {cls.endTime}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditClass(cls)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteClass(cls.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
