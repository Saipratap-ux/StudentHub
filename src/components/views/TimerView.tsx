import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Sparkles,
  Flame,
  CloudRain,
  Radio,
  Coffee,
  Volume
} from 'lucide-react';
import { FocusSession, Task, UserSettings } from '../../types';

interface TimerViewProps {
  timerMode: 'focus' | 'short_break' | 'long_break';
  setTimerMode: (mode: 'focus' | 'short_break' | 'long_break') => void;
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTaskId: (id: string) => void;
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
  completedTodaySessions: FocusSession[];
  settings: UserSettings;
  ambientSound: 'none' | 'rain' | 'whitenoise' | 'cafebuzz';
  onSelectAmbientSound: (sound: 'none' | 'rain' | 'whitenoise' | 'cafebuzz') => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  timerMode,
  setTimerMode,
  timeLeft,
  totalTime,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  tasks,
  selectedTaskId,
  setSelectedTaskId,
  activeSubject,
  setActiveSubject,
  completedTodaySessions,
  settings,
  ambientSound,
  onSelectAmbientSound,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Minutes and seconds calculation
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG Circular progress math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Active task selection
  const pendingTasks = tasks.filter((t) => !t.completed);
  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  const getModeColor = () => {
    switch (timerMode) {
      case 'focus': return '#2563EB'; // Blue
      case 'short_break': return '#10B981'; // Emerald
      case 'long_break': return '#8B5CF6'; // Purple
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-6 pb-12 ${
      isFullscreen
        ? 'fixed inset-0 z-50 bg-slate-900 text-white p-6 sm:p-12 overflow-y-auto flex flex-col justify-between'
        : ''
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${
            isFullscreen ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            Pomodoro Focus Timer
          </h1>
          <p className={`text-xs mt-1 ${
            isFullscreen ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
          }`}>
            Work in focused 25-minute sprints with periodic cognitive rest to maintain peak memory retention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isFullscreen
                ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
            title="Toggle Distraction-Free Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Zen Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Console */}
      <div className={`p-6 sm:p-10 rounded-3xl border text-center transition-all ${
        isFullscreen
          ? 'bg-slate-800/60 border-slate-700 my-auto max-w-2xl mx-auto w-full'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
      }`}>
        {/* Mode Segmented Switcher */}
        <div className="inline-flex items-center gap-1 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl mb-8">
          <button
            onClick={() => setTimerMode('focus')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              timerMode === 'focus'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Focus ({settings.focusDuration}m)
          </button>
          <button
            onClick={() => setTimerMode('short_break')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              timerMode === 'short_break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Short Break ({settings.shortBreakDuration}m)
          </button>
          <button
            onClick={() => setTimerMode('long_break')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              timerMode === 'long_break'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long Break ({settings.longBreakDuration}m)
          </button>
        </div>

        {/* Circular Progress & Big Digital Timer */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="text-slate-100 dark:text-slate-800 stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Animated Progress Ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={getModeColor()}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-linear"
            />
          </svg>

          {/* Center Digital Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className={`text-5xl sm:text-6xl font-mono font-bold tracking-tight tabular-nums ${
              isFullscreen ? 'text-white' : 'text-slate-900 dark:text-white'
            }`}>
              {formattedTime}
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-slate-400 mt-2">
              {timerMode === 'focus' ? 'Study Sprint' : 'Rest & Recharge'}
            </span>
          </div>
        </div>

        {/* Task linking */}
        <div className="max-w-md mx-auto mt-6 mb-6">
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Focusing on task:
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => {
              setSelectedTaskId(e.target.value);
              const t = tasks.find((item) => item.id === e.target.value);
              if (t) setActiveSubject(t.subject);
            }}
            className={`w-full px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isFullscreen
                ? 'bg-slate-800 text-white border-slate-700'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="">-- General Study Session --</option>
            {pendingTasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.subject})
              </option>
            ))}
          </select>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onResetTimer}
            className={`p-3 rounded-2xl border transition-colors ${
              isFullscreen
                ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-700'
            }`}
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleTimer}
            className={`px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-md transition-transform active:scale-95 flex items-center gap-2.5 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={onSkipTimer}
            className={`p-3 rounded-2xl border transition-colors ${
              isFullscreen
                ? 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 border-slate-200 dark:border-slate-700'
            }`}
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Noise Selector Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 max-w-lg mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Ambient Focus Atmosphere (Web Audio Generator)
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'none', label: 'Silent', icon: VolumeX },
              { id: 'rain', label: 'Rain', icon: CloudRain },
              { id: 'whitenoise', label: 'White Noise', icon: Radio },
              { id: 'cafebuzz', label: 'Cafe Hum', icon: Coffee },
            ].map((snd) => {
              const Icon = snd.icon;
              const isSelected = ambientSound === snd.id;
              return (
                <button
                  key={snd.id}
                  onClick={() => onSelectAmbientSound(snd.id as unknown as 'none' | 'rain' | 'whitenoise' | 'cafebuzz')}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  <span>{snd.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Completed Sessions Summary */}
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Today's Completed Pomodoros
            </h3>
          </div>
          <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
            {completedTodaySessions.length} sessions (
            {completedTodaySessions.reduce((acc, s) => acc + s.durationMinutes, 0)} mins total)
          </span>
        </div>

        {completedTodaySessions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">
            No focus sessions logged yet today. Press Start Focus above to log your first sprint!
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {completedTodaySessions.map((sess, idx) => (
              <div
                key={sess.id || idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              >
                <span className="text-base leading-none">🍅</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {sess.taskTitle || sess.subject || 'Focus Sprint'}
                </span>
                <span className="text-slate-400 text-[11px]">
                  {sess.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
