const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};

let inMemoryTransactions = [];

export const mockApi = {
  fetchTransactions: async () => {
    await delay(1000); 
    if (isStorageAvailable()) {
      const saved = localStorage.getItem('zorvyn_transactions');
      inMemoryTransactions = saved ? JSON.parse(saved) : [];
    }
    return [...inMemoryTransactions];
  },

  saveTransaction: async (transaction) => {
    await delay(800);
    inMemoryTransactions = [transaction, ...inMemoryTransactions];
    
    if (isStorageAvailable()) {
      localStorage.setItem('zorvyn_transactions', JSON.stringify(inMemoryTransactions));
    }
    return transaction;
  },

  updateTransaction: async (id, updatedData) => {
    await delay(800);
    inMemoryTransactions = inMemoryTransactions.map(t => 
      t.id === id ? { ...t, ...updatedData } : t
    );
    
    if (isStorageAvailable()) {
      localStorage.setItem('zorvyn_transactions', JSON.stringify(inMemoryTransactions));
    }
    return inMemoryTransactions.find(t => t.id === id);
  },
  
  deleteTransaction: async (id) => {
    await delay(500);
    inMemoryTransactions = inMemoryTransactions.filter(t => t.id !== id);
    
    if (isStorageAvailable()) {
      localStorage.setItem('zorvyn_transactions', JSON.stringify(inMemoryTransactions));
    }
    return id;
  }
};