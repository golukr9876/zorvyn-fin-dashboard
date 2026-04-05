import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CategoryChart = () => {
  const { transactions, isDarkMode } = useFinance();

  const categoryData = transactions.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  // Empty State handle
  if (transactions.length === 0) {
    return (
      <div className="h-87.5 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-300 dark:border-slate-700 text-gray-400 dark:text-gray-500 mt-8">
        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full mb-3">
          <BarChart3 size={40} className="opacity-20" />
        </div>
        <p className="font-medium">No transactions until now</p>
        <p className="text-xs">Add a transaction to see the analytics</p>
      </div>
    );
  }

  return (
    <div className="h-87.5 w-full pb-13 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm mt-8 transition-colors">
      <h3 className="text-lg font-semibold mb-2 dark:text-white">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#1e293b' : '#fff', 
              borderRadius: '12px', 
              border: isDarkMode ? '1px solid #334155' : 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              color: isDarkMode ? '#fff' : '#000'
            }}
            itemStyle={{ color: isDarkMode ? '#fff' : '#000' }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            iconType="circle" 
            height={70} 
            formatter={(value) => <span className="text-gray-600 dark:text-gray-400 text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;