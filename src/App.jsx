import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from './context/FinanceContext';
import { 
  LayoutDashboard, ReceiptText, UserCircle, Menu, X, 
  Lightbulb, Sun, Moon, CalendarDays 
} from 'lucide-react';
import FinancialChart from './components/FinancialChart';
import CategoryChart from './components/CategoryChart';
import TransactionList from './components/TransactionList';

function App() {
  const { role, setRole, transactions, isDarkMode, toggleDarkMode, isLoading } = useFinance();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('zorvyn_active_tab') || 'dashboard';
  });

  const [viewDate, setViewDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  useEffect(() => {
    localStorage.setItem('zorvyn_active_tab', activeTab);
  }, [activeTab]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const totalBalanceEver = useMemo(() => {
    const inc = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const exp = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return inc - exp;
  }, [transactions]);

  const openingBalance = useMemo(() => {
    const selectedDate = new Date(viewDate.year, viewDate.month, 1);
    return transactions
      .filter(t => new Date(t.date) < selectedDate)
      .reduce((acc, t) => {
        return t.type === 'income' ? acc + t.amount : acc - t.amount;
      }, 0);
  }, [transactions, viewDate]);


  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === viewDate.month && tDate.getFullYear() === viewDate.year;
    });
  }, [transactions, viewDate]);

  const monthlyIncome = filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const monthlyExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const closingBalance = openingBalance + monthlyIncome - monthlyExpense;


  const insights = useMemo(() => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return {
      topCategory: topCategory ? topCategory[0] : 'N/A',
      totalSpent: topCategory ? topCategory[1] : 0
    };
  }, [filteredTransactions]);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);


  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-blue-600 italic">Zorvyn Fin</h1>
        <div className="flex gap-2">
          <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-yellow-400">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={toggleMenu} className="p-2 text-gray-600 dark:text-gray-300">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:flex
      `}>
        <div>
          <h1 className="hidden md:block text-2xl font-bold text-blue-600 mb-10 italic">Zorvyn Fin</h1>
          <nav className="space-y-4">
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('transactions'); setIsMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${activeTab === 'transactions' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <ReceiptText size={20} /> <span>Transactions</span>
            </button>
          </nav>
        </div>

        <div className="space-y-4">
           <button 
            onClick={toggleDarkMode}
            className="hidden md:flex items-center justify-center gap-2 w-full p-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
          >
            {isDarkMode ? <><Sun size={18} className="text-yellow-500"/> Light Mode</> : <><Moon size={18} className="text-blue-500"/> Dark Mode</>}
          </button>

          <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 text-center underline decoration-blue-200 dark:decoration-blue-800">Switch Role</p>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded p-2 text-sm text-gray-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="admin">Admin Mode</option>
              <option value="viewer">Viewer Mode</option>
            </select>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-10 gap-6 border-b border-gray-100 dark:border-slate-800 pb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {activeTab === 'dashboard' ? 'Financial Overview' : 'Transactions List'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, here's what's happening.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 px-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
              <CalendarDays size={18} className="text-blue-500" />
              <select 
                value={viewDate.month}
                onChange={(e) => setViewDate({...viewDate, month: parseInt(e.target.value)})}
                className="bg-transparent text-sm font-bold outline-none cursor-pointer dark:text-white"
              >
                {months.map((m, i) => <option key={m} value={i} className="dark:bg-slate-900 dark:text-white">{m}</option>)}
              </select>
              <select 
                value={viewDate.year}
                onChange={(e) => setViewDate({...viewDate, year: parseInt(e.target.value)})}
                className="bg-transparent text-sm font-bold outline-none cursor-pointer dark:text-white border-l border-gray-200 dark:border-slate-700 ml-1 pl-2"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                  <option key={y} value={y} className="dark:bg-slate-900 dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 px-5 rounded-full border border-gray-200 dark:border-slate-800 shadow-sm">
              <UserCircle size={22} className="text-blue-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">{role} Mode</span>
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="flex flex-col gap-10"> 
            {isLoading ? ( 
              <div className="flex flex-col items-center justify-center min-h-100 w-full bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <h2 className="text-lg font-bold text-gray-800 dark:text-white animate-pulse">Fetching {months[viewDate.month]} Data...</h2>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white">
                    <p className="text-xs font-bold uppercase opacity-80">Total Wallet Balance</p>
                    <h3 className="text-2xl font-black mt-1">${totalBalanceEver.toLocaleString()}</h3>
                    <p className="text-[10px] mt-2 bg-white/20 inline-block px-2 py-0.5 rounded">All Time</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold uppercase">Opening ({months[viewDate.month]})</p>
                    <h3 className="text-2xl font-black mt-1 dark:text-white">${openingBalance.toLocaleString()}</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm border-l-4 border-l-green-500">
                    <p className="text-xs text-green-600 font-bold uppercase">Monthly Income</p>
                    <h3 className="text-2xl font-black mt-1 text-green-700 dark:text-green-400">+${monthlyIncome.toLocaleString()}</h3>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm border-l-4 border-l-red-500">
                    <p className="text-xs text-red-600 font-bold uppercase">Monthly Expense</p>
                    <h3 className="text-2xl font-black mt-1 text-red-700 dark:text-red-400">-${monthlyExpense.toLocaleString()}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <FinancialChart transactions={filteredTransactions} openingBalance={openingBalance} />
                  <CategoryChart transactions={filteredTransactions} />
                </div>

                <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/10 rounded-full -mr-16 -mt-16 opacity-50"></div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
                      <Lightbulb size={24} />
                    </div>
                    <h3 className="text-xl font-bold dark:text-white">Smart Insights ({months[viewDate.month]})</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="bg-blue-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-blue-100 dark:border-slate-700">
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase mb-1">Top Spending</p>
                      <p className="text-xl font-extrabold text-gray-800 dark:text-gray-100">{insights.topCategory}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total: ${insights.totalSpent}</p>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-gray-600 dark:text-gray-400 italic leading-relaxed">
                        {insights.topCategory !== 'N/A' 
                          ? `Looks like ${insights.topCategory} is taking up a large chunk of your budget this month.`
                          : "No spending data for this month yet!"}
                      </p>
                    </div>
                  </div>
                </section>

                <TransactionList transactions={filteredTransactions} />
              </>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TransactionList transactions={filteredTransactions} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;