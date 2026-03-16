import React, { useState, useEffect } from 'react';

const BankReconciliation = () => {
  const [bankData, setBankData] = useState([]);
  const [selectedBank, setSelectedBank] = useState('FNB');
  const [loading, setLoading] = useState(false);

  const banks = ['FNB', 'StandardBank', 'Absa', 'Capitec'];

  const fetchBankFeeds = () => {
    setLoading(true);
    fetch(`http://localhost:8000/bank/feeds?bank_name=${selectedBank}&use_mock=true`)
      .then(res => res.json())
      .then(data => {
        if (data.transactions) {
          setBankData(data.transactions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBankFeeds();
  }, [selectedBank]);

  const totalCredits = bankData
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = bankData
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Bank Reconciliation</h2>
        <button 
          onClick={fetchBankFeeds}
          disabled={loading}
          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Sync'}
        </button>
      </div>

      {/* Bank Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Select Bank</label>
        <select 
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          {banks.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-green-50 rounded">
          <p className="text-xs text-green-600 font-semibold uppercase">Credits In</p>
          <p className="text-lg font-bold text-green-700">R {totalCredits.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-red-50 rounded">
          <p className="text-xs text-red-600 font-semibold uppercase">Debits Out</p>
          <p className="text-lg font-bold text-red-700">R {totalDebits.toFixed(2)}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 text-sm">Date</th>
              <th className="text-left py-2 text-sm">Description</th>
              <th className="text-right py-2 text-sm">Reference</th>
              <th className="text-right py-2 text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {bankData.map((tx, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="py-2 text-sm">{tx.date}</td>
                <td className="py-2 text-sm">{tx.description}</td>
                <td className="py-2 text-sm text-right text-gray-500">{tx.reference}</td>
                <td className={`py-2 text-sm text-right font-mono ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R {tx.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {bankData.length === 0 && (
        <p className="text-gray-500 text-center py-4">No transactions found</p>
      )}
    </div>
  );
};

export default BankReconciliation;
