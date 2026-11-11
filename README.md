# SAIPRATAP StudentHub – Smart Student Productivity Dashboard

> **"Your study life, organized in one place."**

**SAIPRATAP StudentHub** is a modern, responsive, production-grade student productivity web application and installable Progressive Web App (PWA). It brings together daily task management, course timetables, a functional Pomodoro focus timer with ambient soundscapes, rich markdown study notes, academic calendar deadlines, and productivity analytics — all with offline capability and browser `LocalStorage` persistence.

🌐 **Live URL**: [https://saipratap-ux.github.io/StudentHub/](https://saipratap-ux.github.io/StudentHub/)  
📂 **Repository**: [https://github.com/Saipratap-ux/StudentHub](https://github.com/Saipratap-ux/StudentHub)

---

## 🛠️ White Blank Page Repair Summary

If your GitHub Pages deployment shows a blank white page, this is caused by:
1. **Unbuilt TypeScript**: Deploying `/src/main.tsx` directly to static GitHub Pages. Static web hosting cannot execute raw TypeScript JSX files without compiling.
2. **Missing Repository Base Path**: Absolute paths (`/assets/...`) returning `404 Not Found` when hosted under a subfolder path like `/StudentHub/`.

### The Technical Solution
- **Vite Configuration**: Set `base: process.env.VITE_BASE_PATH || './'` in `vite.config.ts`, generating relative asset URLs that resolve properly on GitHub Pages.
- **GitHub Actions Automation**: Added `.github/workflows/deploy.yml` to automatically install dependencies, run `npm run build`, and deploy the compiled `dist/` directory on every push to `main`.
- **React ErrorBoundary**: Wrapped the application in `ErrorBoundary.tsx` with error recovery and local storage reset tools so uncaught errors never leave a white blank screen.
- **PWA & Offline Capability**: Created `public/manifest.json`, `public/sw.js` (service worker), app icons (`icon.svg`, PNGs), in-app install buttons, and offline status indicators.

---

## ✨ Core Features

- 📊 **Dynamic Dashboard**: Real-time KPI metrics, study streak counter, today's lecture schedule, priority task checklist, and motivational study tips.
- ✅ **Task Management (Full CRUD)**: Add, edit, delete, and complete coursework tasks with priority badges (`High`, `Medium`, `Low`), course tags, estimated durations, and celebratory confetti.
- 📅 **Study Planner & Timetable**: Interactive weekly schedule and day-by-day view with course codes, room links, professor names, and color tags.
- ⏱️ **Pomodoro Focus Timer**: 25m Focus / 5m Short Break / 15m Long Break intervals with circular progress, session logging, task linking, and Web Audio ambient generators (*Rain, White Noise, Cafe Hum*).
- 📝 **Study Notes**: Rich note taking with markdown formatted preview, subject categorizations, search, tagging, pinning, one-click copy, and `.md` file download.
- 📆 **Academic Calendar**: Monthly calendar grid visualizing assignment deadlines and recurring class schedules.
- 📈 **Productivity Analytics**: Daily study hours timelines for 7 and 14 days, subject distribution breakdown, task completion rates, and CSV study log export.
- 📱 **Installable PWA**: Works offline, installable to Home Screen on mobile and desktop, with service worker cache management.
- 🌓 **Dual Theme (Light & Dark Mode)**: Tailored dark navy `#0B1120` and purple gradient aesthetic.
- 💾 **100% Client-Side LocalStorage Persistence**: Offline-ready data storage with full JSON Backup Export & Import capabilities.

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

### Step 1: Push the Source Code to GitHub
```bash
git add .
git commit -m "fix: resolve blank white page with automated GitHub Actions build and PWA"
git push origin main
```

### Step 2: Configure GitHub Pages Source
1. Open your repository on GitHub: `https://github.com/Saipratap-ux/StudentHub`
2. Click on **Settings** (top navigation tab).
3. In the left sidebar, click **Pages** (under *Code and automation*).
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** from the dropdown menu.
5. GitHub will now automatically trigger the workflow in `.github/workflows/deploy.yml`, build the site into `dist/`, and deploy it!

### Step 3: Access Your Live Website
Within 60–90 seconds, your site will be live at:
```
https://saipratap-ux.github.io/StudentHub/
```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Test production build
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
StudentHub/
├── .github/
│   └── workflows/
│       └── deploy.yml           # Automated GitHub Actions Pages deployment
├── public/
│   ├── manifest.json            # PWA Web App Manifest
│   ├── sw.js                    # Offline Service Worker
│   ├── icon.svg                 # Brand SVG icon
│   ├── apple-touch-icon.png     # iOS Safari touch icon
│   ├── pwa-192x192.png          # 192px Android home screen icon
│   ├── pwa-512x512.png          # 512px Android home screen icon
│   └── pwa-maskable-512x512.png # 512px Maskable icon
├── src/
│   ├── main.tsx                 # Entry point with ErrorBoundary & SW registration
│   ├── App.tsx                  # Root application state & navigation router
│   ├── index.css                # Tailwind CSS v4 styles & custom dark variant
│   ├── types/
│   │   └── index.ts             # TypeScript definitions
│   ├── hooks/
│   │   └── usePWAInstall.ts     # PWA installation detection & prompt hook
│   ├── utils/
│   │   ├── audio.ts             # Web Audio API synthesizers
│   │   └── storage.ts           # LocalStorage helpers & student demo seed
│   └── components/
│       ├── ErrorBoundary.tsx    # React error catcher preventing white blank screens
│       ├── PWAInstallButton.tsx # Cross-platform install button
│       ├── OfflineIndicator.tsx # Offline connection status notification
│       ├── Navbar.tsx           # Header bar with PWA button & search
│       ├── Sidebar.tsx          # Responsive navigation & student profile
│       └── views/               # Dashboard, Tasks, Planner, Timer, Notes, Calendar, Analytics
├── index.html                   # HTML entry with PWA meta tags
├── package.json                 # Project dependencies & build scripts
├── vite.config.ts               # Vite configuration with relative base path ('./')
└── README.md                    # Project documentation
```

---

## 📄 License

Apache-2.0. Built by Saipratap Dansana.
