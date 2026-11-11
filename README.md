# StudentHub – Smart Student Productivity Dashboard

> **"Your study life, organized in one place."**

**StudentHub** is a modern, responsive, production-grade student productivity web application. It brings together daily task management, course timetables, a functional Pomodoro focus timer with ambient soundscapes, rich markdown study notes, academic calendar deadlines, and productivity analytics — all completely offline-ready with persistent browser `LocalStorage`.

---

## ✨ Features

- 📊 **Dynamic Dashboard**: Real-time KPI metrics, focus streak counter, today's lecture schedule, priority task checklist, and motivational study tips.
- ✅ **Task Management (Full CRUD)**: Add, edit, delete, and complete coursework tasks with priority badges (`High`, `Medium`, `Low`), course tags, estimated durations, and celebratory confetti upon task completion.
- 📅 **Study Planner & Timetable**: Interactive weekly schedule and day-by-day view with course codes, room numbers/links, professor names, and color tags.
- ⏱️ **Pomodoro Focus Timer**: 25m Focus / 5m Short Break / 15m Long Break intervals with SVG progress circle, real-time digital countdown, session logging, task-linking, and built-in Web Audio ambient generators (*Rain, White Noise, Cafe Hum*).
- 📝 **Study Notes**: Rich note taking with markdown formatted preview, subject categorizations, search, tagging, pinning, one-click copy, and `.md` file download.
- 📆 **Academic Calendar**: Monthly calendar grid visualizing assignment deadlines and recurring class schedules, with single-day inspection and quick task addition.
- 📈 **Productivity Analytics**: Daily study hours timelines for 7 and 14 days, subject distribution breakdown, task completion rates, and CSV study log export.
- 🌓 **Dual Theme (Light & Dark Mode)**: Tailored colors and contrast compliance for late-night study sessions.
- 💾 **100% Client-Side LocalStorage Persistence**: Offline-ready data storage with full JSON Backup Export & Import capabilities.
- 🚀 **GitHub Pages Compatible**: Completely static frontend without requiring a paid server or API keys.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4 with custom dark mode variants
- **Icons**: Lucide React
- **Audio**: Web Audio API (Chimes + White/Brown noise ambient synthesizer)
- **Effects**: Canvas Confetti
- **Storage**: Browser LocalStorage
- **Build Tool**: Vite

---

## 🚀 Quick Start (Local Development)

To run StudentHub locally:

```bash
# 1. Clone repository
git clone https://github.com/YOUR-USERNAME/studenthub.git
cd studenthub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 🌐 How to Deploy for Free on GitHub Pages

You can host **StudentHub** for free directly from GitHub:

### Step 1: Create a GitHub Repository
1. Log into your [GitHub](https://github.com/) account.
2. Click **New Repository**.
3. Name the repository: `studenthub`.
4. Set the visibility to **Public**.
5. Do **not** check "Add a README file" (the project already includes one).
6. Click **Create repository**.

### Step 2: Push your code to GitHub
Run the following commands in your project terminal:

```bash
git init
git add .
git commit -m "feat: complete StudentHub productivity dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/studenthub.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. In your GitHub repository, click on **Settings** (top tab).
2. In the left sidebar, click **Pages** (under "Code and automation").
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and folder `/ (root)`.
4. Click **Save**.

### Step 4: Access Your Live Portfolio Site
Within 1 to 2 minutes, GitHub will publish your site at:

```
https://YOUR-USERNAME.github.io/studenthub/
```

*(Note: If deploying a Vite build artifact directly, you can also run `npm run build` and deploy the `dist` folder to the `gh-pages` branch).*

---

## 📁 Project Structure

```
studenthub/
├── index.html                   # HTML entry point with meta tags & fonts
├── package.json                 # Dependencies & scripts
├── metadata.json                # Project identity & description
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
├── README.md                    # Project documentation & deployment guide
└── src/
    ├── App.tsx                  # Root application state & navigation router
    ├── main.tsx                 # React entry point
    ├── index.css                # Global styles & Tailwind CSS v4 setup
    ├── types/
    │   └── index.ts             # TypeScript interfaces (Task, Note, Class, Session)
    ├── utils/
    │   ├── audio.ts             # Web Audio API synthesizers for chimes & ambient sounds
    │   └── storage.ts           # LocalStorage helpers & sample academic data
    ├── assets/
    │   └── images/              # High-fidelity photography assets
    └── components/
        ├── Navbar.tsx           # 3-Zone top navigation & search shortcut
        ├── Sidebar.tsx          # Responsive navigation & student profile card
        ├── views/
        │   ├── DashboardView.tsx # Overview KPIs, schedules, & priority checklist
        │   ├── TasksView.tsx     # Full CRUD task manager with filters & confetti
        │   ├── PlannerView.tsx   # Weekly grid & day-by-day timetable
        │   ├── TimerView.tsx     # Pomodoro focus timer with ambient soundscapes
        │   ├── NotesView.tsx     # Rich markdown study notes & tagging
        │   ├── CalendarView.tsx  # Monthly calendar of deadlines & lectures
        │   └── AnalyticsView.tsx # Study statistics & CSV export
        └── modals/
            ├── TaskModal.tsx        # Add / Edit task modal
            ├── ClassModal.tsx       # Schedule / Edit class block modal
            ├── NoteModal.tsx        # Add / Edit study note modal
            ├── SettingsModal.tsx    # Preferences, study goals, & JSON backups
            ├── QuickSearchModal.tsx # Global ⌘K search modal
            └── GitHubGuideModal.tsx # Interactive in-app deployment walkthrough
```

---

## 📄 License

Apache-2.0. Feel free to customize and add this project to your developer portfolio!
