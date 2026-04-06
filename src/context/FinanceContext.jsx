import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockApi } from '../api/mockApi';

const FinanceContext = createContext();

const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

export const FinanceProvider = ({ children }) => {
  const storageAvailable = isStorageAvailable();

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [role, setRole] = useState(() => {
    if (storageAvailable) return localStorage.getItem('zorvyn_role') || 'admin';
    return 'admin';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (storageAvailable) return localStorage.getItem('theme') === 'dark';
    return false;
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await mockApi.fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (storageAvailable) {
      try { localStorage.setItem('zorvyn_role', role); } catch (e) {}
    }
  }, [role, storageAvailable]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      if (storageAvailable) try { localStorage.setItem('theme', 'dark'); } catch(e){}
    } else {
      document.documentElement.classList.remove('dark');
      if (storageAvailable) try { localStorage.setItem('theme', 'light'); } catch(e){}
    }
  }, [isDarkMode, storageAvailable]);

  const addTransaction = async (data) => {
    const newTx = { ...data, id: Date.now().toString() };
    try {
      await mockApi.saveTransaction(newTx);
      setTransactions(prev => [newTx, ...prev]);
    } catch (error) {
      console.error("Failed to add transaction", error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      await mockApi.updateTransaction(id, updatedData);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
    } catch (error) {
      console.error("Failed to update transaction", error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await mockApi.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete transaction", error);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);



  const [viewDate, setViewDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === viewDate.month && tDate.getFullYear() === viewDate.year;
    });
  }, [transactions, viewDate]);

  return (
    <FinanceContext.Provider value={{ 
      isDarkMode, toggleDarkMode, 
      transactions, isLoading,
      role, setRole, 
      addTransaction, updateTransaction, deleteTransaction,
      viewDate, 
      setViewDate, 
      filteredTransactions,
      allTransactions: transactions 
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);