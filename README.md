# Expense Tracker

A modern, professional expense tracking web application built with Next.js 14, TypeScript, and Tailwind CSS. Track your personal finances with an intuitive interface, powerful analytics, and comprehensive features.

## Features

### Core Functionality
- **Add Expenses**: Quickly add expenses with date, amount, category, and description
- **Edit & Delete**: Modify or remove existing expenses with confirmation dialogs
- **Search & Filter**: Find expenses by keyword, category, or date range
- **Data Persistence**: All data is stored in localStorage for quick access

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Dashboard
- **Summary Cards**: View total spending, monthly spending, and top category at a glance
- **Visual Charts**:
  - Pie chart showing spending by category
  - Bar chart displaying monthly spending trends
  - Category comparison bar chart
- **Analytics**: Real-time calculations and spending insights

### User Experience
- Clean, modern interface with a professional color scheme
- Fully responsive design for desktop, tablet, and mobile
- Form validation with helpful error messages
- Visual feedback for all user actions
- Loading states for better UX
- Intuitive navigation with tab-based interface

### Data Management
- **Export to CSV**: Download your expenses as a CSV file for external analysis
- **Real-time Updates**: All changes are immediately reflected in charts and summaries
- **Persistent Storage**: Data is automatically saved to localStorage

## Getting Started

### Prerequisites
- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd expense-tracker-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

To run the production build:

```bash
npm start
```

## How to Use

### Adding an Expense
1. Navigate to the Dashboard or Expenses tab
2. Fill out the expense form:
   - **Date**: Select the date of the expense (defaults to today)
   - **Amount**: Enter the expense amount in USD
   - **Category**: Choose from 6 predefined categories
   - **Description**: Provide a brief description (minimum 3 characters)
3. Click "Add Expense" to save

### Viewing Expenses
- **Dashboard Tab**: See summary cards, charts, and add new expenses
- **Expenses Tab**: View all expenses in a detailed list with search and filter options

### Filtering Expenses
1. Go to the Expenses tab
2. Use the filters:
   - **Search**: Type keywords to search descriptions, categories, or amounts
   - **Category**: Filter by specific category or view all
   - **Date Range**: Select start and end dates to filter by date
3. Click "Reset Filters" to clear all filters

### Editing an Expense
1. Find the expense in the list
2. Click the edit icon (pencil)
3. Modify the details in the form
4. Click "Update Expense" to save or "Cancel" to discard changes

### Deleting an Expense
1. Find the expense in the list
2. Click the delete icon (trash can)
3. Confirm the deletion by clicking "Confirm"

### Exporting Data
1. Click the "Export to CSV" button in the header
2. A CSV file will be downloaded with all visible expenses
3. Open the file in Excel, Google Sheets, or any spreadsheet application

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Date Utilities**: date-fns
- **Storage**: localStorage API
- **Icons**: Heroicons (via inline SVG)

## Project Structure

```
expense-tracker-ai/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page component
├── components/
│   ├── ExpenseForm.tsx      # Form for adding/editing expenses
│   ├── ExpenseList.tsx      # List view of expenses
│   ├── ExpenseFilters.tsx   # Filter controls
│   ├── ExpenseChart.tsx     # Chart visualizations
│   ├── SummaryCards.tsx     # Dashboard summary cards
│   └── ExportButton.tsx     # CSV export functionality
├── lib/
│   ├── storage.ts           # localStorage utilities
│   └── utils.ts             # Helper functions
├── types/
│   └── expense.ts           # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.js
```

## Features in Detail

### Form Validation
- All fields are required
- Amount must be a positive number
- Description must be at least 3 characters
- Date cannot be in the future
- Real-time validation with error messages

### Analytics
- **Total Spending**: Sum of all expenses across all time
- **Monthly Total**: Expenses for the current month
- **Top Category**: Category with the highest spending
- **Category Breakdown**: Percentage distribution of spending by category
- **Monthly Trends**: Last 6 months of spending data

### Responsive Design
- Mobile-first approach
- Breakpoints optimized for all screen sizes
- Touch-friendly interface for mobile devices
- Adaptive layouts for tablets and desktops

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Privacy

All expense data is stored locally in your browser's localStorage. No data is sent to any external servers. Your financial information remains completely private and under your control.

## Troubleshooting

### Data Not Persisting
- Ensure localStorage is enabled in your browser
- Check that you're not in private/incognito mode
- Clear browser cache and reload the application

### Charts Not Displaying
- Ensure you have added at least one expense
- Check browser console for any JavaScript errors
- Verify that JavaScript is enabled

### Export Not Working
- Check that pop-ups are not blocked in your browser
- Ensure you have at least one expense to export
- Verify that downloads are enabled

## Future Enhancements

Potential features for future versions:
- Budget tracking and alerts
- Recurring expenses
- Multiple currency support
- Cloud sync with authentication
- Receipt photo uploads
- Advanced analytics and insights
- Custom categories
- Income tracking
- Financial goals

## License

This project is open source and available for personal and educational use.

## Support

For issues, questions, or suggestions, please open an issue in the project repository.

---

**Built with Next.js 14, TypeScript, and Tailwind CSS**
