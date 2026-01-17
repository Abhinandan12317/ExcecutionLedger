<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Execution Ledger

A strict, immutable daily tracking system for personal productivity. Runs 100% locally in your browser—no API keys, no cloud, no data leaks. Designed for students, professionals, and anyone who wants to build discipline and track progress over time.

---

## MVP Features

- **Immutable Daily Submission:** Once you submit your daily record, it cannot be edited or deleted. This enforces discipline and honest tracking.
- **Customizable Task List:** Add, remove, or rename tasks to fit your goals (e.g., DSA, DevOps, Project, Internship, Research, Workout).
- **Performance Analytics:** Visualize your streaks, gaps, and overall performance with charts and stats.
- **Local Storage Only:** All data is stored in your browser's local storage. No backend, no sign-in, no tracking.
- **Confetti & Seals:** Celebrate daily wins with fun animations and digital seals.
- **Responsive UI:** Works on desktop and mobile, with a clean, notebook-inspired interface.

---

## How It Works

1. **Set Your Tasks:** Define the daily tasks you want to track (e.g., coding, exercise, study).
2. **Mark Completion:** Each day, mark which tasks you completed. Submit your record before midnight.
3. **Immutable Ledger:** Once submitted, your record for the day is locked. No edits allowed.
4. **View Analytics:** See your progress, streaks, and performance breakdowns in the Analytics Panel and Notebook Chart.

---

## Project Structure

- App.tsx — Main application logic and state management
- components/ — UI components (NotebookChart, AnalyticsPanel, NotebookTask, Hero3D, etc.)
- utils/ — Utility functions for date handling and local storage
- types.ts — Type definitions for tasks and records
- metadata.json — Project metadata
- package.json — Dependencies and scripts

---

## Technologies Used

- **React 19** — UI framework
- **Vite** — Fast build tool
- **TypeScript** — Type safety
- **Recharts** — Data visualization
- **Framer Motion** — Animations
- **Canvas Confetti** — Celebration effects

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Customization

- **Edit Task List:** Click the edit icon to add/remove tasks. Changes apply to future records only.
- **Data Privacy:** All data is stored locally. To reset, clear your browser's local storage.

---

## Roadmap & Future Plans

- Cloud sync (optional, privacy-first)
- Multi-device support
- Advanced analytics (heatmaps, trends)
- Habit reminders & notifications
- Export/import data
- Theming & accessibility improvements

---

## Author & License

Made by [Your Name]. MIT License.

---

## Screenshots

![Execution Ledger Screenshot](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

---

## Feedback & Contributions

Feel free to open issues or submit pull requests for improvements!
