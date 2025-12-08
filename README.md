# TruEstate Sales Management System

A modern, full-stack sales transaction management system with advanced search, filtering, sorting, and pagination capabilities. Built with Node.js/Express backend and React/Vite frontend.

## Overview

This application provides a comprehensive interface for managing and analyzing retail sales data. It supports real-time search across customer information, multi-select filtering on 7+ fields, flexible sorting options, and efficient pagination for large datasets.

## Tech Stack

**Backend:**
- Node.js + Express.js (REST API)
- CSV Parser for data loading
- In-memory data store for fast queries

**Frontend:**
- React 18
- Vite (build tool)
- Axios (HTTP client)
- Vanilla CSS with modern design system

**Deployment:**
- Backend: Render/Railway
- Frontend: Vercel/Netlify

## Search Implementation Summary

The search functionality implements full-text search across Customer Name and Phone Number fields:

- **Case-insensitive matching**: Converts both query and data to lowercase
- **Partial matching**: Supports substring searches
- **Debounced input**: 300ms delay to optimize API calls
- **Preserves state**: Works seamlessly with active filters and sorting
- **Performance**: O(n) complexity with early returns for empty queries

## Filter Implementation Summary

Multi-select filtering with AND/OR logic across 7 filter types:

- **Customer Region**: Multi-select dropdown (OR logic within filter)
- **Gender**: Multi-select dropdown
- **Age Range**: Bucketed ranges (18-25, 26-35, 36-45, 46-55, 56+)
- **Product Category**: Multi-select dropdown
- **Tags**: Multi-select dropdown
- **Payment Method**: Multi-select dropdown
- **Date Range**: Start and end date pickers (AND logic)

**Logic**: Multiple selections within same filter type use OR logic. Different filter types use AND logic. Example: (Region=North OR Region=South) AND (Gender=Male) AND (Date >= 2021-01-01).

**UI Features**: Active filter badges with individual remove buttons, "Clear All" functionality, visual feedback for selected filters.

## Sorting Implementation Summary

Three sorting options with ascending/descending order:

- **Date**: Sorts transactions chronologically (newest first by default)
- **Quantity**: Sorts by transaction quantity
- **Customer Name**: Alphabetical sorting (A-Z or Z-A)

**Implementation**: Stable sort algorithm that preserves active search and filter states. Default sort is Date (descending).

## Pagination Implementation Summary

Efficient pagination with state retention:

- **Page Size**: 10 items per page (configurable)
- **Smart Navigation**: Previous/Next buttons with page numbers
- **Ellipsis Display**: Shows ... for large page counts
- **State Preservation**: Maintains search, filter, and sort states across pages
- **Auto-reset**: Returns to page 1 when search/filters change
- **Metadata**: Displays current page, total pages, and total items

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (or use `.env.example`):
```env
PORT=5000
CSV_FILE_PATH=../truestate_assignment_dataset.csv
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### Running Both Servers

Open two terminal windows and run:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

## API Endpoints

### GET /api/transactions
Fetch transactions with optional query parameters:
- `search`: Search query string
- `region`: Comma-separated regions
- `gender`: Comma-separated genders
- `ageRange`: Comma-separated age ranges
- `category`: Comma-separated categories
- `tags`: Comma-separated tags
- `paymentMethod`: Comma-separated payment methods
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)
- `sortBy`: date | quantity | customerName
- `sortOrder`: asc | desc
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### GET /api/filters/options
Fetch available filter options (unique values for all filter fields)

## Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_BASE_URL=<your-backend-url>/api`
6. Deploy

## Features

✅ Full-text search on customer name and phone
✅ Multi-select filtering (7+ filter types)
✅ Flexible sorting (date, quantity, name)
✅ Efficient pagination (10 items/page)
✅ Responsive design (mobile, tablet, desktop)
✅ Modern UI with glassmorphism and animations
✅ Dynamic background with animated gradients
✅ Loading and empty states
✅ Error handling
✅ State persistence across operations

## Project Structure

```
TruEstate/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
├── docs/
│   └── architecture.md
└── README.md
```

## License

MIT
