import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Trash2, 
  Play, 
  Calendar, 
  Clock, 
  Filter, 
  ArrowUpDown, 
  Sparkles,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Priority, Task } from '../../types';

interface TasksViewProps {
  tasks: Task[];
  onOpenTaskModal: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onClearCompleted: () => void;
  onStartFocusForTask: (task: Task) => void;
}

type FilterStatus = 'all' | 'pending' | 'completed';
type SortOption = 'dueDate' | 'priority' | 'title';

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onOpenTaskModal,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onClearCompleted,
  onStartFocusForTask,
}) => {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Extract distinct subjects
  const allSubjects = Array.from(new Set(tasks.map((t) => t.subject))).filter(Boolean);

  // Toggle handler with celebratory confetti
  const handleToggle = (task: Task) => {
    if (!task.completed) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    onToggleTask(task.id);
  };

  // Filter & Search Logic
  const filteredTasks = tasks
    .filter((task) => {
      // Status filter
      if (filterStatus === 'pending' && task.completed) return false;
      if (filterStatus === 'completed' && !task.completed) return false;

      // Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;

      // Subject filter
      if (filterSubject !== 'all' && task.subject !== filterSubject) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesSubject = task.subject.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubject && !matchesDesc) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return a.dueDate.localeCompare(b.dueDate);
      }
      if (sortBy === 'priority') {
        const pOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return a.title.localeCompare(b.title);
    });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const getDueBadge = (dueDateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dueDateStr < today) {
      return { text: 'Overdue', color: 'text-red-600 dark:text-red-400 font-semibold' };
    }
    if (dueDateStr === today) {
      return { text: 'Due Today', color: 'text-amber-600 dark:text-amber-400 font-semibold' };
    }
    return { text: `Due ${dueDateStr}`, color: 'text-slate-500 dark:text-slate-400' };
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header bar with counts and Primary CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tasks & Coursework
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>{pendingCount} Pending</span>
            <span>·</span>
            <span>{completedCount} Completed</span>
            <span>·</span>
            <span>{tasks.length} Total</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Clear Completed
            </button>
          )}
          <button
            onClick={onOpenTaskModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>

      {/* Control Strip: Status Segmented Tabs + Search + Subject/Priority Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['all', 'pending', 'completed'] as FilterStatus[]).map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${
                  filterStatus === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st} ({st === 'all' ? tasks.length : st === 'pending' ? pendingCount : completedCount})
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks by name or course..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Priority filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Subject filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Subject:</span>
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Subjects</option>
              {allSubjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 ml-auto">
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No tasks found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            {searchQuery || filterPriority !== 'all' || filterSubject !== 'all'
              ? 'Try adjusting your search query or filters to find what you are looking for.'
              : 'You have no pending tasks in this category. Great job keeping on top of your studies!'}
          </p>
          <button
            onClick={onOpenTaskModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create a Task</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const dueInfo = getDueBadge(task.dueDate);
            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all ${
                  task.completed
                    ? 'border-slate-200/60 dark:border-slate-800/60 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox + Title + Metadata */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => handleToggle(task)}
                      className="mt-0.5 w-5 h-5 rounded border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:border-blue-500 transition-colors shrink-0"
                      aria-label={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm sm:text-base font-semibold leading-tight ${
                            task.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </span>

                        {/* Priority indicator tag */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
                              : task.priority === 'medium'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Clean inline metadata separated by dots */}
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2 flex-wrap font-mono">
                        <span className="font-sans font-medium text-slate-700 dark:text-slate-300">
                          {task.subject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className={dueInfo.color}>
                          {dueInfo.text} {task.dueTime && `(${task.dueTime})`}
                        </span>
                        {task.estimatedMinutes && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{task.estimatedMinutes}m est.</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Focus in Pomodoro, Edit, Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!task.completed && (
                      <button
                        onClick={() => onStartFocusForTask(task)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        title="Start Pomodoro focus session for this task"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden md:inline">Focus</span>
                      </button>
                    )}

                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Task"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                      title="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
