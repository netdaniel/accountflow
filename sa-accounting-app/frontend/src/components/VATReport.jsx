import React, { useState, useEffect } from 'react';

const VATReport = () => {
  const [vatData, setVatData] = useState({ output_vat: 0, input_vat: 0, net_payable: 0 });
  const [loading, setLoading] = useState(false);

  const fetchVATReport = () => {
    setLoading(true);
    fetch('http://localhost:8000/reports/vat201')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setVatData(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchVATReport();
  }, []);

  const isRefund = vatData.net_payable < 0;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">SARS VAT201 Summary</h2>
        <button 
          onClick={fetchVATReport}
          disabled={loading}
          className="text-sm text-blue-600 hover:underline disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Output VAT (On Sales)</span>
          <span className="font-mono text-green-600 font-semibold">
            R {vatData.output_vat?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">Input VAT (On Purchases)</span>
          <span className="font-mono text-red-600 font-semibold">
            - R {vatData.input_vat?.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between pt-2 text-lg font-bold">
          <span>Net VAT {isRefund ? 'Refund' : 'Payable'}</span>
          <span className={isRefund ? "text-green-700" : "text-red-700"}>
            R {Math.abs(vatData.net_payable)?.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <p>VAT Rate: 15% | Reporting Period: Current</p>
        <p className="mt-1">Status: {isRefund ? 'Refund due from SARS' : 'Payment due to SARS'}</p>
      </div>
    </div>
  );
};

export default VATReport;
