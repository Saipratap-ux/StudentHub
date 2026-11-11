import React, { useState } from 'react';
import { X, Github, Copy, Check, ExternalLink, Terminal, Globe, Rocket, ShieldCheck } from 'lucide-react';

interface GitHubGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubGuideModal: React.FC<GitHubGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Step 1: Create a GitHub Repository',
      description: 'Go to GitHub.com, click "New Repository", name it "studenthub", keep it Public, and do not initialize with README (we already have one).',
      code: '# On GitHub website:\n# Repository name: studenthub\n# Visibility: Public',
    },
    {
      title: 'Step 2: Initialize Git and Push to GitHub',
      description: 'Run these commands in your local project terminal to commit and push the files to your new GitHub repository:',
      code: `git init
git add .
git commit -m "feat: complete StudentHub productivity dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/studenthub.git
git push -u origin main`,
    },
    {
      title: 'Step 3: Enable Free GitHub Pages Hosting',
      description: 'In your GitHub repository: Go to Settings → Pages. Under "Build and deployment", set Source to "Deploy from a branch", select "main" branch and "/ (root)" folder, then click Save!',
      code: '# GitHub Repo -> Settings -> Pages\n# Source: Deploy from a branch\n# Branch: main / root\n# Click Save',
    },
    {
      title: 'Step 4: Your Live Portfolio URL',
      description: 'GitHub will automatically publish your website within 1–2 minutes! Your live portfolio website will be live at:',
      code: 'https://YOUR-USERNAME.github.io/studenthub/',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                GitHub Pages Deployment Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deploy StudentHub for free on your GitHub portfolio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Highlight Banner */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900 rounded-xl">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
                  Zero Server Costs & 100% Client-Side
                </h4>
                <p className="text-xs text-blue-800/80 dark:text-blue-300 mt-1 leading-relaxed">
                  StudentHub runs entirely in the browser using HTML5, CSS3, JavaScript/TypeScript, and LocalStorage. It requires no backend server or monthly costs, making it ideal for GitHub Pages hosting!
                </p>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {s.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(s.code, idx)}
                    className="flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 leading-relaxed">
                  {s.description}
                </p>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-xs font-mono overflow-x-auto leading-relaxed">
                  {s.code}
                </pre>
              </div>
            ))}
          </div>

          {/* Checklist */}
          <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Pre-Deployment Verification Checklist</span>
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Responsive on mobile, tablet, and widescreen desktop</li>
              <li>Tasks, notes, timetable, and study analytics persist across browser refresh</li>
              <li>Light and Dark mode with seamless theme toggle</li>
              <li>Includes complete README.md in root directory</li>
              <li>No paid backend required — 100% offline-ready LocalStorage</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <a
            href="https://docs.github.com/en/pages"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>GitHub Pages Official Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            Got it, Let's Build
          </button>
        </div>
      </div>
    </div>
  );
};
