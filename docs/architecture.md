# TruEstate Sales Management System - Architecture Documentation

## System Overview

The TruEstate Sales Management System is a full-stack web application designed to manage and analyze retail sales transactions. The system follows a clean, layered architecture with clear separation between frontend and backend responsibilities.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  Components │  │    Pages     │  │   Services/API   │   │
│  │  - Header   │  │  - Dashboard │  │  - Axios Client  │   │
│  │  - Search   │  └──────────────┘  │  - Transaction   │   │
│  │  - Filters  │                     │    Service       │   │
│  │  - Table    │  ┌──────────────┐  └──────────────────┘   │
│  │  - Sort     │  │  Hooks/Utils │                          │
│  │  - Pagination│  │  - Debounce  │                         │
│  └─────────────┘  │  - Formatters│                          │
│                   └──────────────┘                           │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      Backend (Express)                       │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │   Routes     │  │ Controllers │  │    Services      │   │
│  │ - /api/      │  │ - Transaction│  │  - Search        │   │
│  │   transactions│  │   Controller│  │  - Filter        │   │
│  │ - /api/      │  └─────────────┘  │  - Sort          │   │
│  │   filters    │                    │  - Pagination    │   │
│  └──────────────┘  ┌─────────────┐  └──────────────────┘   │
│                    │ Middleware  │                          │
│                    │ - CORS      │  ┌──────────────────┐   │
│                    │ - Error     │  │     Utils        │   │
│                    │   Handler   │  │  - Data Loader   │   │
│                    └─────────────┘  │  - Validators    │   │
│                                     └──────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  CSV Dataset │
                  │  (In-Memory) │
                  └──────────────┘
```

## Backend Architecture

### Layer Structure

The backend follows a clean, layered architecture pattern:

#### 1. Routes Layer (`src/routes/`)
- **Responsibility**: Define API endpoints and map them to controllers
- **Files**:
  - `transactionRoutes.js`: Handles `/api/transactions` and `/api/filters/options` endpoints
- **Pattern**: Express Router for modular route definitions

#### 2. Controllers Layer (`src/controllers/`)
- **Responsibility**: Handle HTTP requests, validate input, orchestrate services, format responses
- **Files**:
  - `transactionController.js`: Main controller for transaction operations
- **Functions**:
  - `getTransactions()`: Orchestrates search, filter, sort, and pagination
  - `getFilters()`: Returns available filter options
- **Pattern**: Request → Validation → Service Calls → Response

#### 3. Services Layer (`src/services/`)
- **Responsibility**: Business logic implementation, data manipulation
- **Files**:
  - `searchService.js`: Full-text search implementation
  - `filterService.js`: Multi-select filtering with AND/OR logic
  - `sortService.js`: Sorting algorithms for different fields
  - `paginationService.js`: Pagination logic and metadata generation
- **Pattern**: Pure functions that transform data

#### 4. Utils Layer (`src/utils/`)
- **Responsibility**: Utility functions, data loading, validation
- **Files**:
  - `dataLoader.js`: CSV parsing, data transformation, in-memory storage
  - `validators.js`: Input validation and sanitization
- **Pattern**: Reusable helper functions

#### 5. Middleware Layer (`src/middleware/`)
- **Responsibility**: Request/response processing, error handling
- **Files**:
  - `errorHandler.js`: Global error handling and 404 responses
- **Pattern**: Express middleware functions

#### 6. Config Layer (`src/config/`)
- **Responsibility**: Application constants and configuration
- **Files**:
  - `constants.js`: Age ranges, sort fields, filter mappings
- **Pattern**: Exported constants

### Data Flow (Backend)

```
1. Client Request
   ↓
2. Express Router (routes/)
   ↓
3. Controller (controllers/)
   ├─→ Validate input (utils/validators.js)
   ├─→ Get data (utils/dataLoader.js)
   ├─→ Apply search (services/searchService.js)
   ├─→ Apply filters (services/filterService.js)
   ├─→ Apply sorting (services/sortService.js)
   └─→ Apply pagination (services/paginationService.js)
   ↓
4. Format Response
   ↓
5. Send to Client
```

### Data Loading Strategy

**In-Memory Storage:**
- CSV file is loaded once on server startup
- Data is parsed and stored in memory for fast access
- Age ranges are pre-calculated and indexed
- Filter options are extracted and cached

**Advantages:**
- Sub-second query response times
- No database setup required
- Simple deployment

**Trade-offs:**
- Memory usage (~235MB dataset)
- Data is read-only (no updates)
- Server restart required for data changes

## Frontend Architecture

### Component Structure

#### 1. Pages (`src/pages/`)
- **Dashboard.jsx**: Main application page
  - Manages global state (search, filters, sort, pagination)
  - Orchestrates API calls
  - Handles user interactions
  - Renders all components

#### 2. Components (`src/components/`)
- **Header.jsx**: Branding and navigation
- **SearchBar.jsx**: Search input with debounce and clear button
- **FilterPanel.jsx**: Multi-select filters with active filter badges
- **TransactionTable.jsx**: Data table with loading/empty states
- **SortDropdown.jsx**: Sorting options dropdown
- **Pagination.jsx**: Page navigation controls
- **DynamicBackground.jsx**: Animated gradient background

#### 3. Services (`src/services/`)
- **api.js**: Axios client with interceptors
- **transactionService.js**: API calls for transactions and filters

#### 4. Hooks (`src/hooks/`)
- **useDebounce.js**: Debounce hook for search optimization

#### 5. Utils (`src/utils/`)
- **formatters.js**: Date, currency, and number formatting

#### 6. Styles (`src/styles/`)
- **index.css**: Global styles, design system, CSS variables
- **components.css**: Component-specific styles

### State Management

**Local State (useState):**
- Search query
- Active filters (object with arrays)
- Sort configuration (sortBy, sortOrder)
- Pagination (currentPage)
- Transactions data
- Loading/error states
- Filter options

**State Flow:**
```
User Interaction
   ↓
Update State (useState)
   ↓
Debounce (for search)
   ↓
useEffect Trigger
   ↓
API Call (fetchTransactions)
   ↓
Update Transactions State
   ↓
Re-render Components
```

### Data Flow (Frontend)

```
1. User Action (search, filter, sort, paginate)
   ↓
2. Update State
   ↓
3. useEffect Detects Change
   ↓
4. API Service Call
   ├─→ Build query parameters
   ├─→ Send HTTP request
   └─→ Handle response/error
   ↓
5. Update Transactions State
   ↓
6. Components Re-render
   ├─→ TransactionTable shows data
   ├─→ Pagination updates
   └─→ Loading states clear
```

## API Design

### RESTful Endpoints

#### GET /api/transactions
**Purpose**: Fetch transactions with optional filters

**Query Parameters:**
- `search` (string): Search query
- `region` (string): Comma-separated regions
- `gender` (string): Comma-separated genders
- `ageRange` (string): Comma-separated age ranges
- `category` (string): Comma-separated categories
- `tags` (string): Comma-separated tags
- `paymentMethod` (string): Comma-separated payment methods
- `startDate` (string): Start date (YYYY-MM-DD)
- `endDate` (string): End date (YYYY-MM-DD)
- `sortBy` (string): date | quantity | customerName
- `sortOrder` (string): asc | desc
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### GET /api/filters/options
**Purpose**: Get available filter values

**Response:**
```json
{
  "success": true,
  "filters": {
    "regions": ["North", "South", ...],
    "genders": ["Male", "Female", ...],
    "ageRanges": ["18-25", "26-35", ...],
    "categories": ["Electronics", ...],
    "tags": ["Premium", ...],
    "paymentMethods": ["Credit Card", ...]
  }
}
```

## Data Model

### Transaction Object
```javascript
{
  transactionId: string,
  date: string (YYYY-MM-DD),
  customerId: string,
  customerName: string,
  phoneNumber: string,
  gender: string,
  age: number,
  ageRange: string,
  customerRegion: string,
  customerType: string,
  productId: string,
  productName: string,
  brand: string,
  productCategory: string,
  tags: string,
  quantity: number,
  pricePerUnit: number,
  discountPercentage: number,
  totalAmount: number,
  finalAmount: number,
  paymentMethod: string,
  orderStatus: string,
  deliveryType: string,
  storeId: string,
  storeLocation: string,
  salespersonId: string,
  employeeName: string
}
```

## Performance Optimizations

### Backend
1. **In-Memory Data**: Fast O(1) access to dataset
2. **Early Returns**: Skip processing for empty queries
3. **Efficient Filtering**: Single-pass filtering with combined logic
4. **Stable Sorting**: Maintains order for equal elements
5. **Pagination**: Only send required data slice

### Frontend
1. **Debounced Search**: Reduces API calls (300ms delay)
2. **State Batching**: React batches state updates
3. **Conditional Rendering**: Only render when data changes
4. **CSS Animations**: Hardware-accelerated transforms
5. **Lazy Loading**: Components render on demand

## Design Decisions

### Why In-Memory Storage?
- **Pros**: Fast queries, simple deployment, no DB setup
- **Cons**: Memory usage, read-only data
- **Decision**: Dataset is static and fits in memory; speed is priority

### Why Vanilla CSS?
- **Pros**: Full control, no build overhead, smaller bundle
- **Cons**: More verbose than utility frameworks
- **Decision**: Modern CSS features (variables, grid, flexbox) are sufficient

### Why Multi-Select Dropdowns?
- **Pros**: Familiar UI pattern, space-efficient
- **Cons**: Less discoverable than checkboxes
- **Decision**: Active filter badges provide visibility

### Why Debounce Search?
- **Pros**: Reduces API calls, better UX
- **Cons**: Slight delay in results
- **Decision**: 300ms is imperceptible but saves many requests

## Folder Structure

### Backend
```
backend/
├── src/
│   ├── config/           # Constants and configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── index.js          # Entry point
├── package.json
└── .env
```

### Frontend
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API client and services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Helper functions
│   ├── styles/           # CSS files
│   ├── App.jsx           # Root component
│   └── main.jsx          # Entry point
├── public/               # Static assets
├── index.html
├── package.json
└── vite.config.js
```

## Module Responsibilities

### Backend Modules

**dataLoader.js**
- Load CSV file
- Parse and validate data
- Calculate age ranges
- Extract unique filter values
- Store in memory

**searchService.js**
- Case-insensitive text search
- Partial matching
- Search across multiple fields

**filterService.js**
- Multi-select filtering
- AND/OR logic implementation
- Date range filtering

**sortService.js**
- Sort by date, quantity, or name
- Ascending/descending order
- Stable sort algorithm

**paginationService.js**
- Calculate page slices
- Generate pagination metadata
- Handle edge cases

**transactionController.js**
- Orchestrate all services
- Validate input
- Format responses
- Error handling

### Frontend Modules

**Dashboard.jsx**
- Global state management
- API call orchestration
- User interaction handling
- Component composition

**SearchBar.jsx**
- Search input UI
- Debounce integration
- Clear functionality

**FilterPanel.jsx**
- Multi-select UI
- Active filter display
- Filter management

**TransactionTable.jsx**
- Data display
- Loading states
- Empty states

**SortDropdown.jsx**
- Sort options UI
- Sort state management

**Pagination.jsx**
- Page navigation UI
- Page number calculation

**transactionService.js**
- Build API requests
- Handle responses
- Error handling

## Security Considerations

1. **CORS**: Configured to allow only frontend origin
2. **Input Validation**: All user inputs are validated
3. **Error Handling**: Errors don't expose sensitive information
4. **No SQL Injection**: No database, CSV data is read-only
5. **XSS Prevention**: React escapes output by default

## Scalability Considerations

**Current Limitations:**
- In-memory storage limits dataset size
- Single server instance
- No caching layer

**Future Improvements:**
- Database integration (PostgreSQL/MongoDB)
- Redis caching for frequent queries
- Load balancing for multiple instances
- CDN for static assets
- Server-side pagination for very large datasets

## Testing Strategy

**Backend Testing:**
- Unit tests for services (search, filter, sort, pagination)
- Integration tests for API endpoints
- Edge case testing (empty results, invalid inputs)

**Frontend Testing:**
- Component unit tests
- Integration tests for user flows
- E2E tests for critical paths
- Responsive design testing

**Manual Testing:**
- Cross-browser compatibility
- Performance testing with large datasets
- UX testing for filter combinations
- Accessibility testing

## Deployment Architecture

```
┌─────────────┐
│   Vercel    │  Frontend (Static)
│  (Frontend) │  - React build
└──────┬──────┘  - CDN distribution
       │
       │ HTTPS
       │
       ▼
┌─────────────┐
│   Render    │  Backend (Node.js)
│  (Backend)  │  - Express server
└──────┬──────┘  - CSV data loaded
       │
       │ File System
       │
       ▼
┌─────────────┐
│ CSV Dataset │
└─────────────┘
```

## Conclusion

This architecture provides a clean, maintainable, and performant solution for managing sales transactions. The layered approach ensures separation of concerns, making the codebase easy to understand, test, and extend. The use of modern technologies and best practices results in a professional-grade application suitable for production deployment.
