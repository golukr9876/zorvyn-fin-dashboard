import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const CategoryChart = () => {
  const { transactions } = useFinance();

  const categoryData = transactions.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  if (transactions.length === 0) {
  return (
    <div className="h-[350px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 mt-8">
      <div className="p-4 bg-gray-50 rounded-full mb-3">
        <BarChart3 size={40} className="opacity-20" />
      </div>
      <p className="font-medium">No transactions until now</p>
      <p className="text-xs">Add a transaction to see the analytics</p>
    </div>
  );
}


  return (
    <div className="h-[350px] w-full pb-13 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mt-8">
      <h3 className="text-lg font-semibold mb-2">Spending by Category</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '10px', border: 'none' }}
          />
          <Legend verticalAlign="bottom"  iconType="circle" height={70} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;