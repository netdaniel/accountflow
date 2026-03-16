import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [pnl, setPnl] = useState({ net_profit: 0, income: 0, expenses: 0 });
  const [formData, setFormData] = useState({ value: '', description: '', type: 'income' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = () => {
    fetch('http://localhost:8000/transactions/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      });

    fetch('http://localhost:8000/reports/pnl')
      .then(res => res.json())
      .then(data => {
        if (data.net_profit !== undefined) {
          setPnl(data);
        }
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const value = formData.type === 'expense' 
      ? -Math.abs(parseFloat(formData.value))
      : Math.abs(parseFloat(formData.value));

    try {
      const response = await fetch(
        `http://localhost:8000/transactions/?value=${value}&desc=${encodeURIComponent(formData.description)}`,
        { method: 'POST' }
      );
      const data = await response.json();
      
      if (data.error) {
        setMessage('Error: ' + data.error);
      } else {
        setMessage('Transaction created successfully!');
        setFormData({ value: '', description: '', type: 'income' });
        fetchData();
      }
    } catch (error) {
      setMessage('Error creating transaction');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded-lg border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Income</p>
          <p className="text-xl font-semibold">R {pnl.income?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Expenses</p>
          <p className="text-xl font-semibold">R {pnl.expenses?.toFixed(2) || '0.00'}</p>
        </div>
        <div className={`p-4 bg-white shadow rounded-lg border-l-4 ${pnl.net_profit >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className="text-xl font-semibold">R {pnl.net_profit?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-bold mb-3">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border rounded-md p-2"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (R)</label>
              <input 
                type="number"
                step="0.01"
                required
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full border rounded-md p-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input 
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded-md p-2"
                placeholder="Enter description"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Add Transaction'}
          </button>
          {message && <p className="text-sm mt-2">{message}</p>}
        </form>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
          <button onClick={fetchData} className="text-sm text-blue-600 hover:underline">Refresh</button>
        </div>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Value</th>
                <th className="text-right py-2">VAT (15%)</th>
                <th className="text-right py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice().reverse().map(t => (
                <tr key={t.id} className="border-b">
                  <td className="py-2">{t.id}</td>
                  <td className="py-2">{t.description}</td>
                  <td className={`py-2 text-right ${t.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R {t.value?.toFixed(2)}
                  </td>
                  <td className="py-2 text-right">R {Math.abs(t.vat_amount || 0).toFixed(2)}</td>
                  <td className="py-2 text-right text-sm text-gray-500">
                    {new Date(t.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
