'use client';

import { useState, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { formatDate, formatCurrency, filterExpenses } from '@/lib/utils';
import { exportToAdvancedCSV, exportToJSON, exportToPDF } from '@/lib/advancedExport';

interface AdvancedExportModalProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'pdf';

const categories: ExpenseCategory[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export default function AdvancedExportModal({ expenses, isOpen, onClose }: AdvancedExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [filename, setFilename] = useState('expense-export');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<ExpenseCategory[]>([...categories]);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');

  // Filter expenses based on selected criteria
  const filteredExpenses = useMemo(() => {
    return filterExpenses(expenses, {
      category: 'All',
      startDate,
      endDate,
      searchQuery: '',
    }).filter(expense => selectedCategories.includes(expense.category));
  }, [expenses, startDate, endDate, selectedCategories]);

  // Calculate export statistics
  const stats = useMemo(() => {
    const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = selectedCategories.map(cat => ({
      category: cat,
      count: filteredExpenses.filter(e => e.category === cat).length,
      total: filteredExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    })).filter(stat => stat.count > 0);

    return {
      totalRecords: filteredExpenses.length,
      totalAmount: total,
      byCategory,
      dateRange: startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : 'All dates',
    };
  }, [filteredExpenses, selectedCategories, startDate, endDate]);

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSelectAllCategories = () => {
    setSelectedCategories([...categories]);
  };

  const handleDeselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      alert('No expenses to export with the current filters');
      return;
    }

    setIsExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

      const finalFilename = filename.trim() || 'expense-export';

      switch (format) {
        case 'csv':
          exportToAdvancedCSV(filteredExpenses, finalFilename);
          break;
        case 'json':
          exportToJSON(filteredExpenses, finalFilename, {
            dateRange: { start: startDate, end: endDate },
            categories: selectedCategories,
            stats,
          });
          break;
        case 'pdf':
          await exportToPDF(filteredExpenses, finalFilename, stats);
          break;
      }

      // Success - close modal after short delay
      setTimeout(() => {
        setIsExporting(false);
        onClose();
        // Reset form
        setFilename('expense-export');
        setStartDate('');
        setEndDate('');
        setSelectedCategories([...categories]);
        setActiveTab('options');
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div>
            <h2 className="text-2xl font-bold">Advanced Export</h2>
            <p className="text-primary-100 text-sm mt-0.5">Export your expenses with custom options</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-primary-500 rounded-lg transition"
            disabled={isExporting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex px-6">
            <button
              onClick={() => setActiveTab('options')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
                activeTab === 'options'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Export Options
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
                activeTab === 'preview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview Data ({stats.totalRecords} records)
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'options' ? (
            <div className="space-y-6">
              {/* Export Format */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFormat('csv')}
                    className={`p-4 border-2 rounded-lg transition ${
                      format === 'csv'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📊</div>
                    <div className="font-semibold text-gray-900">CSV</div>
                    <div className="text-xs text-gray-500 mt-1">Excel compatible</div>
                  </button>
                  <button
                    onClick={() => setFormat('json')}
                    className={`p-4 border-2 rounded-lg transition ${
                      format === 'json'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📦</div>
                    <div className="font-semibold text-gray-900">JSON</div>
                    <div className="text-xs text-gray-500 mt-1">Developer friendly</div>
                  </button>
                  <button
                    onClick={() => setFormat('pdf')}
                    className={`p-4 border-2 rounded-lg transition ${
                      format === 'pdf'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">📄</div>
                    <div className="font-semibold text-gray-900">PDF</div>
                    <div className="text-xs text-gray-500 mt-1">Print ready</div>
                  </button>
                </div>
              </div>

              {/* Filename */}
              <div>
                <label htmlFor="filename" className="block text-sm font-semibold text-gray-700 mb-2">
                  Filename
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="expense-export"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-gray-500 font-mono text-sm">.{format}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for default name</p>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range (Optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="startDate" className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={endDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                {startDate && endDate && (
                  <button
                    onClick={() => { setStartDate(''); setEndDate(''); }}
                    className="text-xs text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Clear date range
                  </button>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Categories</label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAllCategories}
                      className="text-xs text-primary-600 hover:text-primary-700"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={handleDeselectAllCategories}
                      className="text-xs text-gray-600 hover:text-gray-700"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {categories.map(category => (
                    <label
                      key={category}
                      className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                        selectedCategories.includes(category)
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Export Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Records</div>
                    <div className="text-2xl font-bold text-gray-900">{stats.totalRecords}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Categories</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedCategories.length}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Date Range</div>
                    <div className="text-sm font-semibold text-gray-900">{stats.dateRange}</div>
                  </div>
                </div>
                {stats.byCategory.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="text-xs text-gray-600 mb-2">By Category:</div>
                    <div className="space-y-1">
                      {stats.byCategory.map(cat => (
                        <div key={cat.category} className="flex justify-between text-sm">
                          <span className="text-gray-700">{cat.category}</span>
                          <span className="font-semibold text-gray-900">
                            {cat.count} records • {formatCurrency(cat.total)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Preview Tab
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Data Preview</h3>
                <p className="text-sm text-gray-600">
                  Showing {stats.totalRecords} expense{stats.totalRecords !== 1 ? 's' : ''} that will be exported
                </p>
              </div>

              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-lg font-medium">No expenses match your filters</p>
                  <p className="text-sm mt-1">Adjust your date range or category selection</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Description</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredExpenses.map((expense, idx) => (
                          <tr key={expense.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(expense.date)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                {expense.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                              {formatCurrency(expense.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || filteredExpenses.length === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
