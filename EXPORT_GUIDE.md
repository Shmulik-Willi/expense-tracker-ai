# CSV Export Feature - Usage Guide

## Overview

Your expense tracker includes a simple, functional CSV export feature that allows you to download all your expenses as a CSV file.

## How to Use

### Step 1: Add Some Expenses
1. Open the application at `http://localhost:3000`
2. Add a few expenses using the form (at least 1-3 expenses)
3. Fill in: Date, Amount, Category, and Description

### Step 2: Export Your Data
1. Look at the top-right corner of the page (in the header)
2. Click the green **"Export to CSV"** button
3. Your browser will download a file named: `expenses-YYYY-MM-DD.csv`

### Step 3: Open the CSV File
1. Open the downloaded file in Excel, Google Sheets, or any spreadsheet application
2. You'll see your data with these columns:
   - **Date** - Formatted as "Month DD, YYYY"
   - **Category** - The expense category
   - **Description** - Your expense description
   - **Amount** - The expense amount (formatted to 2 decimal places)

## Features

### What Gets Exported
- **All expenses** currently visible based on your filters
- If you're on the Expenses tab with filters applied, only filtered expenses are exported
- Properly quoted CSV fields to handle commas in descriptions

### Button States
- **Enabled**: Green button when you have expenses to export
- **Disabled**: Gray button when you have no expenses
- **Loading**: Shows spinner and "Exporting..." text while processing

### File Format
```csv
Date,Category,Description,Amount
"Jan 15, 2025","Food","Lunch at restaurant","25.50"
"Jan 16, 2025","Transportation","Uber to work","18.00"
"Jan 17, 2025","Entertainment","Movie tickets","30.00"
```

## Testing the Feature

### Test Scenario 1: Basic Export
1. Add 3 expenses in different categories
2. Click "Export to CSV"
3. Open the downloaded file
4. Verify all 3 expenses are present with correct data

### Test Scenario 2: Empty State
1. If you have no expenses, the button should be disabled
2. Button shows gray and can't be clicked

### Test Scenario 3: Filtered Export
1. Go to the Expenses tab
2. Apply a filter (e.g., only "Food" category)
3. Click "Export to CSV"
4. Only filtered expenses are exported

### Test Scenario 4: Special Characters
1. Add an expense with commas in the description: "Groceries, milk, bread"
2. Export to CSV
3. Open file - description should be properly quoted and intact

## Technical Details

### Implementation
- **Location**: Button in header ([app/page.tsx](app/page.tsx:83))
- **Function**: `exportToCSV()` in [lib/utils.ts](lib/utils.ts:107-131)
- **Component**: [components/ExportButton.tsx](components/ExportButton.tsx:1-51)

### Browser APIs Used
- `Blob` - Creates CSV file content
- `URL.createObjectURL()` - Creates download URL
- `createElement('a')` - Creates download link
- Standard browser download mechanism

### File Naming
- Format: `expenses-YYYY-MM-DD.csv`
- Example: `expenses-2025-01-17.csv`
- Uses current date when export is triggered

## Troubleshooting

### Export Button Not Visible
- Check if you're on the correct page
- Button is in the top-right corner of the header
- Make sure the application loaded correctly

### Button is Disabled
- Add at least one expense first
- The button is disabled when there are no expenses to export

### File Not Downloading
- Check your browser's download settings
- Allow downloads for localhost
- Check browser console for any errors

### CSV File Opens Incorrectly
- Make sure you're using a spreadsheet application (Excel, Google Sheets)
- The file uses UTF-8 encoding
- Fields are properly quoted to handle special characters

## Example CSV Output

Here's what a sample export looks like:

```csv
Date,Category,Description,Amount
"Dec 29, 2024","Food","Coffee and pastry","12.50"
"Dec 29, 2024","Transportation","Gas for car","45.00"
"Dec 30, 2024","Entertainment","Netflix subscription","15.99"
"Dec 30, 2024","Shopping","New headphones","79.99"
"Dec 31, 2024","Bills","Electric bill","125.00"
```

## Next Steps

This is Version 1 of the export feature. Future enhancements could include:
- Export to JSON format
- Export with date range selection
- Export with custom column selection
- Export with formatted currency symbols
- Export with summary statistics

---

**The export feature is simple, functional, and ready to use!** ✅
