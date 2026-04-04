import React, { useState, useMemo } from 'react';
import { useFinance } from './context/FinanceContext';
import { LayoutDashboard, ReceiptText, UserCircle, Menu, X, Lightbulb } from 'lucide-react';
import FinancialChart from './components/FinancialChart';
import CategoryChart from './components/CategoryChart';
import TransactionList from './components/TransactionList';

function App() {
  const { role, setRole, transactions } = useFinance();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  // Requirement 4: Insights Logic
  const insights = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return {
      topCategory: topCategory ? topCategory[0] : 'N/A',
      totalSpent: topCategory ? topCategory[1] : 0
    };
  }, [transactions]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600 italic">Zorvyn Fin</h1>
        <button onClick={toggleMenu} className="p-2 text-gray-600">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:flex
      `}>
        <div>
          <h1 className="hidden md:block text-2xl font-bold text-blue-600 mb-10 italic">Zorvyn Fin</h1>
          <nav className="space-y-4">
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </button>
            <button 
              onClick={() => { setActiveTab('transactions'); setIsMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 w-full rounded-lg transition-all ${activeTab === 'transactions' ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <ReceiptText size={20} /> <span>Transactions</span>
            </button>
          </nav>
        </div>

        <div className="p-4 bg-gray-100 rounded-xl">
          <p className="text-xs text-gray-500 uppercase font-bold mb-2 text-center underline decoration-blue-200">Switch Role</p>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="admin">Admin Mode</option>
            <option value="viewer">Viewer Mode</option>
          </select>
        </div>
      </aside>

      {/* Overlay */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={toggleMenu} />}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {/* Top Header - Mockup jaisa clean layout */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-4 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {activeTab === 'dashboard' ? 'Financial Overview' : 'Transactions List'}
            </h2>
            <p className="text-gray-500 mt-1">Welcome back, here's what's happening.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 px-5 rounded-full border border-gray-200 shadow-sm self-start md:self-auto">
            <UserCircle size={22} className="text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 capitalize">{role} Mode</span>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="flex flex-col gap-10"> {/* Har section ke beech bada gap (Desktop & Mobile) */}
            
            {/* 1. Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Total Balance</p>
                <h3 className="text-3xl font-black mt-2 text-gray-900">${totalBalance.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-green-500">
                <p className="text-sm text-green-600 font-bold uppercase tracking-wider">Total Income</p>
                <h3 className="text-3xl font-black mt-2 text-green-700">${totalIncome.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-red-500">
                <p className="text-sm text-red-600 font-bold uppercase tracking-wider">Total Expenses</p>
                <h3 className="text-3xl font-black mt-2 text-red-700">${totalExpenses.toLocaleString()}</h3>
              </div>
            </div>

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FinancialChart />
              <CategoryChart />
            </div>

            {/* 3. Insights Section - Spacing fix for mobile */}
            <section className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-xl font-bold">Smart Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Top Spending</p>
                  <p className="text-xl font-extrabold text-gray-800">{insights.topCategory}</p>
                  <p className="text-sm text-gray-500 mt-1">Total: ${insights.totalSpent}</p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-gray-600 italic leading-relaxed">
                    "Looks like <span className="font-bold text-blue-600">{insights.topCategory}</span> is taking up a large chunk of your budget. Consider reviewing these costs to save more!"
                  </p>
                </div>
              </div>
            </section>
            {/* <InsightsSection /> */}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TransactionList />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;





const InsightsSection = () => {
  const { transactions } = useFinance();

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topCategory = Object.keys(categorySpending).reduce((a, b) => 
    categorySpending[a] > categorySpending[b] ? a : b, 'None'
  );

  return (
    <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg mt-8">
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        ✨ Smart Insights
      </h3>
      <p className="text-blue-100">
        Your highest spending is in <span className="font-bold text-white uppercase">{topCategory}</span>. 
        Consider tracking this category more closely to save money!
      </p>
    </div>
  );
};