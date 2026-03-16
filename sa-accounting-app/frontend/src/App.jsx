import Dashboard from './components/Dashboard'
import Payroll from './components/Payroll'
import VATReport from './components/VATReport'
import BankReconciliation from './components/BankReconciliation'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4">
        <h1 className="text-2xl font-bold">SA Accounting App</h1>
        <p className="text-sm text-blue-200">South African Tax Compliance & Financial Management</p>
      </header>
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Dashboard />
            <VATReport />
            <BankReconciliation />
          </div>
          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            <Payroll />
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-gray-400 p-4 text-center text-sm mt-8">
        <p>SA Accounting App © 2026 | SARS Compliant VAT & Payroll System</p>
      </footer>
    </div>
  )
}

export default App
