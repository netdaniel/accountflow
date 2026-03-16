import React, { useState } from 'react';

const Payroll = () => {
  const [gross, setGross] = useState(0);
  const [paye, setPaye] = useState(0);

  // Calculations based on SA constants
  const uif = gross * 0.01;
  const netPay = gross - paye - uif;

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold border-b pb-2 mb-4">SARS Payroll Compliance</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Gross Salary (ZAR)</label>
          <input 
            type="number" 
            onChange={(e) => setGross(Number(e.target.value))} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter gross salary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded">
            <p className="text-xs text-blue-600 font-semibold uppercase">PAYE (Tax)</p>
            <input 
              type="number" 
              onChange={(e) => setPaye(Number(e.target.value))} 
              className="w-full bg-transparent border-b border-blue-300 text-lg font-bold mt-1"
              placeholder="0.00"
            />
          </div>
          <div className="p-3 bg-green-50 rounded">
            <p className="text-xs text-green-600 font-semibold uppercase">UIF (Employee 1%)</p>
            <p className="text-lg font-bold">R {uif.toFixed(2)}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg">
          <p className="text-sm">Net Amount to Employee:</p>
          <p className="text-2xl font-bold text-green-400">R {netPay.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
