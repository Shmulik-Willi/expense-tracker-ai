# Quick Start Guide

Get your expense tracker running in 3 simple steps!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, and chart libraries.

## Step 2: Start Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

## Step 3: Start Tracking Expenses

1. Open your browser to `http://localhost:3000`
2. You'll see the Dashboard with three summary cards and empty charts
3. Scroll down to the "Add New Expense" form
4. Fill in your first expense:
   - **Date**: Select today's date (or any past date)
   - **Amount**: Enter an amount (e.g., 25.50)
   - **Category**: Choose a category (e.g., Food)
   - **Description**: Enter a description (e.g., "Lunch at restaurant")
5. Click "Add Expense"
6. Your expense will appear in the dashboard and charts will update!

## Testing All Features

### Add Multiple Expenses
Add several expenses in different categories to see the charts populate with meaningful data.

### View Expenses List
1. Click on the "Expenses" tab in the navigation
2. See all your expenses in a detailed list

### Filter Expenses
1. In the Expenses tab, use the filters:
   - Search by keyword
   - Filter by category
   - Set a date range
2. Click "Reset Filters" to clear all filters

### Edit an Expense
1. Find an expense in the list
2. Click the pencil (edit) icon
3. Modify the details
4. Click "Update Expense"

### Delete an Expense
1. Find an expense in the list
2. Click the trash (delete) icon
3. Click "Confirm" to delete

### Export to CSV
1. Click "Export to CSV" in the header
2. A file will download with all your expenses
3. Open it in Excel or Google Sheets

## Building for Production

```bash
npm run build
npm start
```

## Tips for Best Experience

1. **Add Real Data**: The more expenses you add, the better the analytics become
2. **Use Different Categories**: Spread expenses across categories to see meaningful pie charts
3. **Try Mobile View**: Resize your browser or open on a mobile device to see the responsive design
4. **Export Regularly**: Download your expenses to keep backups
5. **Use Date Filters**: Filter by month to see spending patterns over time

## Troubleshooting

### Port Already in Use
If port 3000 is busy, Next.js will automatically use port 3001. Check the terminal output for the correct URL.

### Changes Not Showing
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage: Open DevTools → Application → Local Storage → Clear

### Build Errors
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Try `npm run build` again

## What to Try

Here are some scenarios to test the full functionality:

1. **Personal Finance Tracking**: Add your actual daily expenses for a week
2. **Monthly Budget**: Track all expenses for a month and use date filters to analyze
3. **Category Analysis**: Add expenses across all categories and see which dominates
4. **Expense Patterns**: Add expenses over several months to see trends in the monthly chart
5. **Data Export**: Add 20+ expenses and export to CSV to see the data format

## Next Steps

Once you're comfortable with the basic features:

1. Customize the categories in [types/expense.ts](types/expense.ts)
2. Adjust the color scheme in [tailwind.config.ts](tailwind.config.ts)
3. Modify chart types in [components/ExpenseChart.tsx](components/ExpenseChart.tsx)
4. Add your own features and enhancements

Enjoy tracking your expenses! 📊💰
