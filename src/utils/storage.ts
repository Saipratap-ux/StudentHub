import { FocusSession, Note, Task, TimetableClass, UserSettings } from '../types';

const STORAGE_KEYS = {
  TASKS: 'studenthub_tasks_v1',
  TIMETABLE: 'studenthub_timetable_v1',
  NOTES: 'studenthub_notes_v1',
  SESSIONS: 'studenthub_sessions_v1',
  SETTINGS: 'studenthub_settings_v1',
  THEME: 'studenthub_theme_v1',
};

// Realistic initial sample data
export const INITIAL_SETTINGS: UserSettings = {
  studentName: 'Alex Rivera',
  studentMajor: 'Computer Science & Cognitive Systems',
  studentSchool: 'University Tech Campus',
  dailyGoalHours: 4,
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  soundEnabled: true,
  ambientSound: 'none',
};

// Generate relative dates for fresh sample data
const today = new Date();
const formatDate = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement Dijkstra Graph Algorithm',
    description: 'Complete the priority queue implementation and write unit tests for directed cyclic graphs.',
    subject: 'Computer Science',
    priority: 'high',
    dueDate: formatDate(1),
    dueTime: '23:59',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    estimatedMinutes: 90,
  },
  {
    id: 'task-2',
    title: 'Calculus III Problem Set 4 (Stokes Theorem)',
    description: 'Solve problems 12 through 28 on surface integrals and vector fields.',
    subject: 'Mathematics',
    priority: 'high',
    dueDate: formatDate(2),
    dueTime: '17:00',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    estimatedMinutes: 60,
  },
  {
    id: 'task-3',
    title: 'Neural Networks Architecture Critique Paper',
    description: 'Draft 4-page analysis comparing Transformer self-attention vs State Space Models (Mamba).',
    subject: 'Artificial Intelligence',
    priority: 'medium',
    dueDate: formatDate(4),
    dueTime: '18:00',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    estimatedMinutes: 120,
  },
  {
    id: 'task-4',
    title: 'Physics II Lab Report: RL & RLC Circuits',
    description: 'Plot oscilloscope voltage decay curves and calculate resonant frequency damping coefficient.',
    subject: 'Physics',
    priority: 'medium',
    dueDate: formatDate(3),
    dueTime: '14:00',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    estimatedMinutes: 75,
  },
  {
    id: 'task-5',
    title: 'Read Modern Operating Systems (Ch 7: Virtual Memory)',
    description: 'Review page fault replacement algorithms (LRU, FIFO, Clock) before Thursday seminar.',
    subject: 'Computer Science',
    priority: 'low',
    dueDate: formatDate(5),
    dueTime: '11:00',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimatedMinutes: 45,
  },
  {
    id: 'task-6',
    title: 'Ethics in Engineering Case Study Submission',
    description: 'Submit peer feedback on the autonomous vehicle liability dilemma.',
    subject: 'Engineering Ethics',
    priority: 'low',
    dueDate: formatDate(-1),
    dueTime: '23:59',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    estimatedMinutes: 30,
  },
];

export const INITIAL_TIMETABLE: TimetableClass[] = [
  {
    id: 'class-1',
    subject: 'Algorithms & Complexity',
    code: 'CS 330',
    day: 'mon',
    startTime: '09:00',
    endTime: '10:30',
    room: 'Turing Hall 302',
    instructor: 'Dr. Evelyn Hayes',
    color: '#3B82F6', // Blue
    notes: 'Review red-black tree balancing before lecture.',
  },
  {
    id: 'class-2',
    subject: 'Multivariable Calculus',
    code: 'MATH 241',
    day: 'mon',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Science Complex 108',
    instructor: 'Prof. Marcus Vance',
    color: '#8B5CF6', // Purple
    notes: 'Homework 4 submission due.',
  },
  {
    id: 'class-3',
    subject: 'AI & Cognitive Models',
    code: 'CS 480',
    day: 'tue',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Informatics Lab 4B',
    instructor: 'Dr. Sophia Lin',
    color: '#06B6D4', // Cyan
    notes: 'Transformer architecture seminar.',
  },
  {
    id: 'class-4',
    subject: 'Physics II: Electromagnetism',
    code: 'PHYS 202',
    day: 'tue',
    startTime: '14:00',
    endTime: '15:30',
    room: 'Faraday Auditorium',
    instructor: 'Dr. James Thorne',
    color: '#F59E0B', // Amber
    notes: 'Maxwell equations demo.',
  },
  {
    id: 'class-5',
    subject: 'Algorithms Discussion / Lab',
    code: 'CS 330L',
    day: 'wed',
    startTime: '13:00',
    endTime: '15:00',
    room: 'CS Lab 2',
    instructor: 'TA Alex Chen',
    color: '#3B82F6',
    notes: 'Pair programming coding benchmark.',
  },
  {
    id: 'class-6',
    subject: 'Multivariable Calculus',
    code: 'MATH 241',
    day: 'wed',
    startTime: '11:00',
    endTime: '12:30',
    room: 'Science Complex 108',
    instructor: 'Prof. Marcus Vance',
    color: '#8B5CF6',
  },
  {
    id: 'class-7',
    subject: 'Operating Systems Internals',
    code: 'CS 350',
    day: 'thu',
    startTime: '09:30',
    endTime: '11:00',
    room: 'Turing Hall 115',
    instructor: 'Dr. Aaron Meyer',
    color: '#10B981', // Emerald
    notes: 'Virtual memory paging demo.',
  },
  {
    id: 'class-8',
    subject: 'Engineering Ethics',
    code: 'ENGR 301',
    day: 'fri',
    startTime: '10:00',
    endTime: '11:30',
    room: 'Humanities Hall 204',
    instructor: 'Prof. Claire Sterling',
    color: '#EC4899', // Pink
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Dijkstra vs A* Algorithm Comparison',
    subject: 'Computer Science',
    content: `# Dijkstra vs A* Shortest Path

## Dijkstra's Algorithm
- Explores all directions uniformly (breadth-like).
- Guaranteed optimal on non-negative edge weights.
- Time complexity: **O((V + E) log V)** using Fibonacci / binary heap.

## A* Search
- Incorporates heuristic h(n) estimating distance to target.
- Evaluation function: **f(n) = g(n) + h(n)**.
- Admissibility: h(n) must never overestimate true cost.
- Consistency: ensures optimal path without re-expanding closed nodes.

> Key takeaway: A* dominates when euclidean or manhattan distance heuristic exists.`,
    tags: ['Algorithms', 'Graphs', 'Search', 'ExamPrep'],
    pinned: true,
    color: '#EEF2FF',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Stokes Theorem & Divergence Theorem Summary',
    subject: 'Mathematics',
    content: `# Vector Calculus Theorems

## Green's Theorem
$\\oint_C (L dx + M dy) = \\iint_D (\\frac{\\partial M}{\\partial x} - \\frac{\\partial L}{\\partial y}) dA$

## Stokes' Theorem
Relates surface integral of curl over open surface S to line integral around boundary $\\partial S$:
$\\iint_S (\\nabla \\times \\mathbf{F}) \\cdot d\\mathbf{S} = \\oint_{\\partial S} \\mathbf{F} \\cdot d\\mathbf{r}$

## Divergence Theorem (Gauss)
Relates volume integral of divergence to flux across closed boundary surface:
$\\iiint_V (\\nabla \\cdot \\mathbf{F}) dV = \\oiint_{\\partial V} (\\mathbf{F} \\cdot \\hat{n}) dS$`,
    tags: ['Math', 'Calculus', 'Vectors', 'Formulas'],
    pinned: true,
    color: '#F5F3FF',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Transformer Attention Mechanism Walkthrough',
    subject: 'Artificial Intelligence',
    content: `# Scaled Dot-Product Attention

Formula:
**Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V**

1. Query & Key dot product measures compatibility / semantic alignment.
2. Dividing by sqrt(d_k) stabilizes gradients when dimensionalities grow large.
3. Softmax outputs normalized weights summing to 1.
4. Multi-head attention projects into distinct subspaces in parallel.`,
    tags: ['AI', 'DeepLearning', 'Transformers'],
    pinned: false,
    color: '#ECFEFF',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Historical sessions for the past 7 days
export const INITIAL_SESSIONS: FocusSession[] = [
  {
    id: 'sess-1',
    subject: 'Computer Science',
    taskTitle: 'Implement Dijkstra Graph Algorithm',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-2',
    subject: 'Computer Science',
    taskTitle: 'Implement Dijkstra Graph Algorithm',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-3',
    subject: 'Mathematics',
    taskTitle: 'Stokes Theorem Problem Set',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-4',
    subject: 'Mathematics',
    taskTitle: 'Stokes Theorem Problem Set',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 86400000 - 3600000).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-5',
    subject: 'Physics',
    taskTitle: 'RLC Circuit Oscilloscope Plotting',
    durationMinutes: 30,
    completedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-6',
    subject: 'Computer Science',
    taskTitle: 'Virtual Memory Reading',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-7',
    subject: 'Artificial Intelligence',
    taskTitle: 'Mamba vs Transformer Research',
    durationMinutes: 50,
    completedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    type: 'focus',
  },
  {
    id: 'sess-8',
    subject: 'Mathematics',
    taskTitle: 'Partial Derivatives drill',
    durationMinutes: 25,
    completedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    type: 'focus',
  },
];

// Storage helpers
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading tasks:', err);
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Error saving tasks:', err);
  }
}

export function loadTimetable(): TimetableClass[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading timetable:', err);
  }
  return INITIAL_TIMETABLE;
}

export function saveTimetable(classes: TimetableClass[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(classes));
  } catch (err) {
    console.error('Error saving timetable:', err);
  }
}

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading notes:', err);
  }
  return INITIAL_NOTES;
}

export function saveNotes(notes: Note[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error('Error saving notes:', err);
  }
}

export function loadSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading sessions:', err);
  }
  return INITIAL_SESSIONS;
}

export function saveSessions(sessions: FocusSession[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions:', err);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error loading settings:', err);
  }
  return INITIAL_SETTINGS;
}

export function saveSettings(settings: UserSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

export function exportAllDataAsJSON(): string {
  const data = {
    app: 'StudentHub',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasks: loadTasks(),
    timetable: loadTimetable(),
    notes: loadNotes(),
    sessions: loadSessions(),
    settings: loadSettings(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed.tasks)) saveTasks(parsed.tasks);
    if (Array.isArray(parsed.timetable)) saveTimetable(parsed.timetable);
    if (Array.isArray(parsed.notes)) saveNotes(parsed.notes);
    if (Array.isArray(parsed.sessions)) saveSessions(parsed.sessions);
    if (parsed.settings && typeof parsed.settings === 'object') saveSettings(parsed.settings);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

export function resetAllDataToDefault() {
  saveTasks(INITIAL_TASKS);
  saveTimetable(INITIAL_TIMETABLE);
  saveNotes(INITIAL_NOTES);
  saveSessions(INITIAL_SESSIONS);
  saveSettings(INITIAL_SETTINGS);
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.TIMETABLE);
  localStorage.removeItem(STORAGE_KEYS.NOTES);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
}
