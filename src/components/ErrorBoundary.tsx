import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('StudentHub ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetStorage = () => {
    if (window.confirm('Reset all saved StudentHub data to default? This will clear any corrupted state and reload.')) {
      try {
        localStorage.clear();
      } catch (e) {
        console.error('Failed to clear localStorage:', e);
      }
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 antialiased font-sans">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Something went wrong</h1>
                <p className="text-xs text-slate-400">
                  StudentHub caught an error and prevented a blank screen.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden">
              <p className="text-xs font-mono text-red-400 break-all leading-relaxed">
                {this.state.error?.message || 'Unknown runtime error occurred.'}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Website</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors border border-slate-700"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Reset LocalStorage & Restore Initial Defaults</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500">
              Your browser LocalStorage can be safely restored if an invalid data format was encountered.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
