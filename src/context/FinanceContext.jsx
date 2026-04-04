import React, { createContext, useContext, useState } from 'react';
import { mockTransactions } from '../data/mockData';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [role, setRole] = useState('admin'); // Default role 'admin' rakhte hain

  // Function to add transaction (Admin only)
  const addTransaction = (newTx) => {
      if (role === 'admin') {
        setTransactions(prev => [{ ...newTx, id: Date.now() }, ...prev]);
      }
    };

    const updateTransaction = (id, updatedTx) => {
      if (role === 'admin') {
        setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedTx } : t));
      }
    };
  const deleteTransaction = (id) => {
    if (role === 'admin') {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  

  
  return (
    <FinanceContext.Provider value={{ transactions, role, setRole, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);