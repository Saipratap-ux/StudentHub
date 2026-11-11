import React, { useState, useEffect } from 'react';
import { Search, X, CheckSquare, FileText, CalendarRange, ArrowRight } from 'lucide-react';
import { ActiveTab, Note, Task, TimetableClass } from '../../types';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  notes: Note[];
  timetable: TimetableClass[];
  onSelectResult: (tab: ActiveTab, targetId?: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  notes,
  timetable,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    : tasks.slice(0, 3);

  const filteredNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.subject.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : notes.slice(0, 3);

  const filteredClasses = q
    ? timetable.filter(
        (c) =>
          c.subject.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          (c.instructor && c.instructor.toLowerCase().includes(q)) ||
          c.room.toLowerCase().includes(q)
      )
    : timetable.slice(0, 3);

  const totalResults = filteredTasks.length + filteredNotes.length + filteredClasses.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all tasks, notes, courses..."
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {totalResults === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No matching results found for "{query}".
              </p>
            </div>
          )}

          {/* Tasks Results */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Tasks & Assignments</span>
                <span className="font-mono">{filteredTasks.length}</span>
              </div>
              <div className="space-y-1">
                {filteredTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onSelectResult('tasks', task.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className={`text-xs sm:text-sm font-medium block truncate ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                        }`}>
                          {task.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {task.subject} · Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes Results */}
          {filteredNotes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Study Notes</span>
                <span className="font-mono">{filteredNotes.length}</span>
              </div>
              <div className="space-y-1">
                {filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      onSelectResult('notes', note.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block truncate">
                          {note.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {note.subject} {note.tags.length > 0 && `· #${note.tags.join(' #')}`}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Timetable / Classes Results */}
          {filteredClasses.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1.5 flex items-center justify-between">
                <span>Courses & Classes</span>
                <span className="font-mono">{filteredClasses.length}</span>
              </div>
              <div className="space-y-1">
                {filteredClasses.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => {
                      onSelectResult('planner', cls.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CalendarRange className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 block truncate">
                          {cls.subject} ({cls.code})
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {cls.day.toUpperCase()} {cls.startTime} - {cls.endTime} · {cls.room}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>Click any item to view details</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
