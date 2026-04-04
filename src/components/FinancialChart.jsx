import {React, useMemo} from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { BarChart3 } from 'lucide-react';

const FinancialChart = () => {
  const { transactions } = useFinance();

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

  console.log("chartdata : ", chartData)

  
  if (transactions.length === 0) {
  return (
    <div className="h-[350px] flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 mt-8">

      <div className="flex flex-col items-center justify-center">
        <div className="p-4 bg-gray-50 rounded-full mb-3">
        <BarChart3 size={40} className="opacity-20" />
      </div>
      <p className="font-medium">No transactions until now</p>
      <p className="text-xs">Add a transaction to see the analytics</p>
      </div>
    </div>
  );
}

  return (
    <div className="h-[350px] w-full pb-10 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mt-8">
      <h3 className="text-lg font-semibold mb-4">Cash Flow Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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