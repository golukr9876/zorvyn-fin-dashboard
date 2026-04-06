# Zorvyn Fin 💸

A professional-grade personal finance dashboard built to demonstrate advanced React patterns, state management, and complex data visualization.

🚀 **Live Demo:** [https://zorvyn-fin-dashboard.vercel.app/](https://zorvyn-fin-dashboard.vercel.app/)

---

## 📖 About the Project

**Zorvyn Fin** is a personal finance tracker designed for users who want a clean, minimalist, yet powerful way to manage their money. As a developer, I built this to master real-world challenges like **Data Persistence**, **Dynamic Filtering**, and **Cumulative Financial Logic**.

## ✨ Key Features

### 1. Smart "Carry Forward" Logic 🧠
Unlike basic trackers, Zorvyn Fin calculates an **Opening Balance** for every month. It looks at your entire transaction history to determine your net worth before the current month starts, ensuring your charts always reflect your true financial status.

### 2. Dynamic Monthly & Yearly Filtering 📅
- Filter transactions by any Month or Year.
- The Year selector is **fully dynamic**, automatically generating a range based on the current date—ensuring the app remains functional in 2027 and beyond without code changes.

### 3. Advanced Data Visualization 📈
- **Cash Flow Trend:** An Area Chart using a `stepAfter` curve to visualize your running balance. It starts from the previous month's closing balance for 100% accuracy.
- **Category Breakdown:** A Pie Chart to quickly identify spending leaks.

### 4. Robust Data Persistence 💾
- Uses `localStorage` to keep your data safe across sessions.
- Includes **Security Error Handling** (try-catch blocks) to prevent crashes in private browsing or restricted environments.

### 5. Dark Mode & UI/UX 🌙
- Fully responsive design built with **Tailwind CSS**.
- Beautifully crafted Dark Mode that adapts every component, including custom styled dropdowns and modals.
- Smooth animations powered by **Framer Motion**.

### 6. Role-Based Access Simulation (RBAC) 🔐
- Toggle between **Admin** (Full CRUD access) and **Viewer** (Read-only) to simulate real-world enterprise application permissions.

---

## 🛠️ Tech Stack

- **Core:** React.js (Vite)
- **State:** Context API (Clean state management without prop drilling)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Framer Motion

---

## 🚀 Local Installation

Want to run this on your machine? Follow these steps:

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/golukr9876/zorvyn-fin-dashboard.git](https://github.com/golukr9876/zorvyn-fin-dashboard.git)
   ```
2. Open the folder
   ```bash
   cd zorvyn-fin-dashboard
   ```
3. Install the dependencies:
   ```bash
   npm run dev
   ```
4. Start the local dev server:
   ```bash
   npm run dev