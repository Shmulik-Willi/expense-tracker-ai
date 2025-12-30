import { Expense, ExpenseCategory } from '@/types/expense';
import { formatDate, formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Advanced CSV Export with enhanced formatting
export const exportToAdvancedCSV = (expenses: Expense[], filename: string): void => {
  // Sort by date
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate totals
  const total = sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Headers with metadata
  const headers = ['Date', 'Category', 'Description', 'Amount'];

  // Add metadata rows
  const metadata = [
    ['Expense Report'],
    [`Generated: ${new Date().toLocaleString()}`],
    [`Total Records: ${sortedExpenses.length}`],
    [`Total Amount: $${total.toFixed(2)}`],
    [], // Empty row
    headers,
  ];

  // Data rows
  const rows = sortedExpenses.map(expense => [
    formatDate(expense.date),
    expense.category,
    expense.description,
    `$${expense.amount.toFixed(2)}`,
  ]);

  // Add summary row
  rows.push([], ['TOTAL', '', '', `$${total.toFixed(2)}`]);

  // Combine all content
  const csvContent = [
    ...metadata,
    ...rows,
  ]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// JSON Export with metadata
export const exportToJSON = (
  expenses: Expense[],
  filename: string,
  metadata: {
    dateRange: { start: string; end: string };
    categories: ExpenseCategory[];
    stats: any;
  }
): void => {
  // Sort by date
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const exportData = {
    metadata: {
      exportDate: new Date().toISOString(),
      totalRecords: sortedExpenses.length,
      totalAmount: sortedExpenses.reduce((sum, exp) => sum + exp.amount, 0),
      dateRange: {
        start: metadata.dateRange.start || 'All',
        end: metadata.dateRange.end || 'All',
      },
      categories: metadata.categories,
    },
    summary: {
      byCategory: metadata.stats.byCategory,
      totalAmount: metadata.stats.totalAmount,
    },
    expenses: sortedExpenses.map(expense => ({
      id: expense.id,
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      createdAt: expense.createdAt,
      updatedAt: expense.updatedAt,
    })),
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF Export with professional formatting
export const exportToPDF = async (
  expenses: Expense[],
  filename: string,
  stats: any
): Promise<void> => {
  // Sort by date
  const sortedExpenses = [...expenses].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Create PDF
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Header
  doc.setFontSize(20);
  doc.setTextColor(14, 165, 233); // Primary blue
  doc.text('Expense Report', 14, 22);

  // Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
  doc.text(`Total Records: ${stats.totalRecords}`, 14, 36);

  // Summary Box
  doc.setFillColor(239, 246, 255); // Light blue background
  doc.roundedRect(14, 42, pageWidth - 28, 30, 3, 3, 'F');

  doc.setFontSize(11);
  doc.setTextColor(30, 58, 138); // Dark blue
  doc.text('Summary', 18, 50);

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(`Total Amount:`, 18, 58);
  doc.setTextColor(14, 165, 233);
  doc.setFontSize(12);
  doc.text(formatCurrency(stats.totalAmount), 55, 58);

  doc.setFontSize(10);
  doc.setTextColor(55, 65, 81);
  doc.text(`Date Range:`, 18, 66);
  doc.text(stats.dateRange, 55, 66);

  // Category breakdown
  if (stats.byCategory && stats.byCategory.length > 0) {
    let yPos = 80;
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('By Category:', 14, yPos);

    yPos += 6;
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);

    stats.byCategory.forEach((cat: any) => {
      const text = `${cat.category}: ${cat.count} records • ${formatCurrency(cat.total)}`;
      doc.text(text, 18, yPos);
      yPos += 5;
    });

    yPos += 5;
  } else {
    let yPos = 90;
  }

  // Expenses Table
  const tableStartY = stats.byCategory.length > 0 ? 80 + (stats.byCategory.length * 5) + 16 : 90;

  const tableData: any[] = sortedExpenses.map(expense => [
    formatDate(expense.date),
    expense.category,
    expense.description,
    formatCurrency(expense.amount),
  ]);

  // Add total row
  tableData.push([
    { content: 'TOTAL', colSpan: 3, styles: { fontStyle: 'bold', halign: 'right' } },
    { content: formatCurrency(stats.totalAmount), styles: { fontStyle: 'bold' } },
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [['Date', 'Category', 'Description', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [14, 165, 233], // Primary blue
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [55, 65, 81],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 35 },
      1: { cellWidth: 35 },
      2: { cellWidth: 80 },
      3: { cellWidth: 30, halign: 'right' },
    },
    margin: { top: 10, left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const footerText = `Page ${data.pageNumber}`;
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        footerText,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    },
  });

  // Save PDF
  doc.save(`${filename}.pdf`);
};
