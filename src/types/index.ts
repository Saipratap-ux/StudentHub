export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  subject: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  estimatedMinutes?: number;
}

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimetableClass {
  id: string;
  subject: string;
  code: string;
  day: DayOfWeek;
  startTime: string; // HH:mm (24h)
  endTime: string;   // HH:mm (24h)
  room: string;
  instructor?: string;
  color: string; // hex or tailwind token
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  tags: string[];
  pinned: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  subject: string;
  durationMinutes: number;
  completedAt: string; // ISO string
  type: 'focus' | 'short_break' | 'long_break';
}

export interface UserSettings {
  studentName: string;
  studentMajor: string;
  studentSchool: string;
  dailyGoalHours: number;
  focusDuration: number;     // minutes (default 25)
  shortBreakDuration: number; // minutes (default 5)
  longBreakDuration: number;  // minutes (default 15)
  autoStartBreaks: boolean;
  soundEnabled: boolean;
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'cafebuzz';
}

export type ActiveTab = 'dashboard' | 'tasks' | 'planner' | 'timer' | 'notes' | 'calendar' | 'analytics';
