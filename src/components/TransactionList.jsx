import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Search, ArrowUpDown, Plus, Edit2, Trash2, X, Receipt } from 'lucide-react';

const TransactionList = () => {
  const { transactions, role, deleteTransaction, addTransaction, updateTransaction } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    type: 'expense',
    amount: ''
  });

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      result = result.filter(t => 
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.toString().includes(searchTerm)
      );
    }
    if (filterType !== 'all') result = result.filter(t => t.type === filterType);
    
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [transactions, searchTerm, filterType, sortConfig]);


  const openModal = (transaction = null) => {
    if (transaction) {
      setEditingId(transaction.id);
      setFormData({ ...transaction });
    } else {
      setEditingId(null);
      setFormData({ date: new Date().toISOString().split('T')[0], category: '', type: 'expense', amount: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, amount: parseFloat(formData.amount) };
    
    if (editingId) {
      updateTransaction(editingId, data);
    } else {
      addTransaction(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-8 overflow-hidden">
      {/* Header Area */}
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="text-lg font-bold">Transactions History</h3>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {role === 'admin' && (
            <button 
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm active:scale-95"
            >
              <Plus size={18} /> Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
              <th className="px-6 py-4 cursor-pointer hover:text-blue-600" onClick={() => setSortConfig({ key: 'date', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Date <ArrowUpDown size={12} className="inline ml-1"/>
              </th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSortedTransactions.length > 0 ? (
            filteredAndSortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm">{t.date}</td>
                <td className="px-6 py-4 text-sm font-medium">{t.category}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.type}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {role === 'admin' ? (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(t)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16}/></button>
                      <button onClick={() => deleteTransaction(t.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Read Only</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-20 text-center">
                <div className="flex flex-col items-center opacity-50">
                  <Receipt size={48} className="mb-2 text-gray-300" />
                  <p className="text-gray-500 font-medium">No transactions found</p>
                  <p className="text-xs text-gray-400">Try adjusting your filters or add a new entry.</p>
                </div>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editingId ? 'Edit Transaction' : 'New Transaction'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                <input 
                  required
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Groceries"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount</label>
                  <input 
                    required
                    type="number" 
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                <input 
                  required
                  type="date" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white p-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-2 active:scale-95"
              >
                {editingId ? 'Save Changes' : 'Add Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;