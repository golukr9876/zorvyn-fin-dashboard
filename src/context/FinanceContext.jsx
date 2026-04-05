import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const FinanceContext = createContext();
const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};
console.log("isSA : ", isStorageAvailable());

export const FinanceProvider = ({ children }) => {
  const storageAvailable = isStorageAvailable();

  const [transactions, setTransactions] = useState(() => {
    if (storageAvailable) {
      const saved = localStorage.getItem('zorvyn_transactions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [role, setRole] = useState(() => {
    if (storageAvailable) {
      return localStorage.getItem('zorvyn_role') || 'admin';
    }
    return 'admin';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (storageAvailable) {
      console.log("dark");
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (storageAvailable) {
      try {
        localStorage.setItem('zorvyn_transactions', JSON.stringify(transactions));
      } catch (e) {
        console.warn("Storage write failed", e);
      }
    }
  }, [transactions, storageAvailable]);

  useEffect(() => {
    if (storageAvailable) {
      try {
        localStorage.setItem('zorvyn_role', role);
      } catch (e) {
        console.warn("Role save failed", e);
      }
    }
  }, [role, storageAvailable]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (storageAvailable) localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      if (storageAvailable) localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, storageAvailable]);

  // --- 3. ACTIONS ---
  const addTransaction = (data) => {
    const newTransaction = { ...data, id: Date.now() };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(transactions.map(t => t.id === id ? { ...updatedData, id } : t));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);


  
  return (
    <FinanceContext.Provider value={{ isDarkMode, toggleDarkMode, transactions, role, setRole, addTransaction, updateTransaction, deleteTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);