'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseFilters, ExpenseCategory, ExpenseFormData } from '@/types/expense';
import { storageUtils } from '@/lib/storage';
import { filterExpenses, calculateSummary } from '@/lib/utils';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFiltersComponent from '@/components/ExpenseFilters';
import SummaryCards from '@/components/SummaryCards';
import ExpenseChart from '@/components/ExpenseChart';
import ExportButton from '@/components/ExportButton';
import AdvancedExportModal from '@/components/AdvancedExportModal';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<ExpenseFilters>({
    category: 'All',
    startDate: '',
    endDate: '',
    searchQuery: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses'>('dashboard');
  const [showAdvancedExport, setShowAdvancedExport] = useState(false);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const loadedExpenses = storageUtils.getExpenses();
    setExpenses(loadedExpenses);
    setIsLoading(false);
  }, []);

  const handleAddExpense = (data: ExpenseFormData) => {
    const newExpense = storageUtils.addExpense({
      date: data.date,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description,
    });
    setExpenses([...expenses, newExpense]);
  };

  const handleEditExpense = (
    id: string,
    data: { date: string; amount: number; category: ExpenseCategory; description: string }
  ) => {
    const updated = storageUtils.updateExpense(id, data);
    if (updated) {
      setExpenses(expenses.map(e => (e.id === id ? updated : e)));
    }
  };

  const handleDeleteExpense = (id: string) => {
    const success = storageUtils.deleteExpense(id);
    if (success) {
      setExpenses(expenses.filter(e => e.id !== id));
    }
  };

  const filteredExpenses = filterExpenses(expenses, filters);
  const summary = calculateSummary(expenses);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
              <p className="text-gray-600 mt-1">Manage your personal finances with ease</p>
            </div>
            <div className="flex gap-3">
              <ExportButton expenses={filteredExpenses} />
              <button
                onClick={() => setShowAdvancedExport(true)}
                disabled={expenses.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition font-medium shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Advanced Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'dashboard'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === 'expenses'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Expenses
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards summary={summary} />

            {/* Charts */}
            <ExpenseChart expenses={expenses} />

            {/* Add Expense Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Expense Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h2>
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>

            {/* Filters */}
            <ExpenseFiltersComponent filters={filters} onFiltersChange={setFilters} />

            {/* Expense Count */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{filteredExpenses.length}</span> of{' '}
                <span className="font-semibold">{expenses.length}</span> expenses
              </p>
            </div>

            {/* Expense List */}
            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Built with Next.js 14, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Advanced Export Modal */}
      <AdvancedExportModal
        expenses={expenses}
        isOpen={showAdvancedExport}
        onClose={() => setShowAdvancedExport(false)}
      />
    </main>
  );
}
