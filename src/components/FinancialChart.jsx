import { React, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { BarChart3 } from 'lucide-react';

const FinancialChart = () => {
  const { transactions, isDarkMode } = useFinance();

  const chartData = useMemo(() => {
    if (transactions.length === 0) return [];

    const sortedTransactions = [...transactions].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    const dailyNetChange = {};
    sortedTransactions.forEach(t => {
      if (!dailyNetChange[t.date]) {
        dailyNetChange[t.date] = 0;
      }
      if (t.type === 'income') {
        dailyNetChange[t.date] += t.amount;
      } else {
        dailyNetChange[t.date] -= t.amount;
      }
    });

    let runningBalance = 0;
    const finalChartData = Object.keys(dailyNetChange).map(date => {
      runningBalance += dailyNetChange[date]; 
      return {
        date: date,
        amount: runningBalance 
      };
    });

    return finalChartData;
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="h-87.5 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 text-gray-400 dark:text-gray-500 mt-8">
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full mb-3">
            <BarChart3 size={40} className="opacity-20" />
          </div>
          <p className="font-medium">No transactions until now</p>
          <p className="text-xs">Add a transaction to see the analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-87.5 w-full pb-10 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm mt-8 transition-colors">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">Cash Flow Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={isDarkMode ? 0.3 : 0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke={isDarkMode ? '#334155' : '#f0f0f0'} 
          />
  
          <XAxis 
            dataKey="date" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }}
            dy={10}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b' }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              color: isDarkMode ? '#f8fafc' : '#1e293b'
            }}
            itemStyle={{ color: isDarkMode ? '#60a5fa' : '#3b82f6' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorAmt)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialChart;