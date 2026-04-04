# Zorvyn Fin 💸

Hey there! Welcome to **Zorvyn Fin**. This is a personal finance dashboard I built to practice my React.js and frontend development skills. 

The idea is simple: it's a web app where you can track your daily expenses, see your total income, and visualize your cash flow over time without things getting too complicated.

## 🚀 Features

- **Live Dashboard:** Calculates your total balance, income, and expenses automatically. As soon as you add a transaction, the numbers update.
- **Transaction Manager:** You can easily add, edit, or delete transactions using a clean modal form.
- **Visual Charts:** - **Cash Flow Trend:** Shows your *running balance* over time (figuring out the cumulative sum logic for this was pretty fun!).
  - **Spending by Category:** A simple pie chart to see where most of your money is going.
- **Basic Role Access:** I added a dummy 'Admin' and 'Viewer' mode. Viewers can only look at the dashboard, while Admins get the buttons to add/delete stuff.
- **Empty States:** If there's no data, the app doesn't just show blank white spaces; it shows nice placeholder messages.

## 🛠️ Tech Stack I Used

- **React.js** (Bootstrapped with Vite)
- **Tailwind CSS** (For all the styling and making it responsive)
- **Recharts** (For rendering the area and pie charts)
- **Lucide React** (For the cool icons)
- **Context API** (Used this for state management so I didn't have to pass props down 10 levels 😅)

## 💻 How to run it locally

If you want to check out the code and run it on your machine, just follow these steps:

1. Clone the repo:
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
   ```
