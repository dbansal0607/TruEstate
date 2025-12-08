import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import SearchBar from '../components/SearchBar.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import TransactionTable from '../components/TransactionTable.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import Pagination from '../components/Pagination.jsx';
import DynamicBackground from '../components/DynamicBackground.jsx';
import { fetchTransactions, fetchFilterOptions } from '../services/transactionService.js';
import { useDebounce } from '../hooks/useDebounce.js';

export default function Dashboard() {
    // State management
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Filter state
    const [activeFilters, setActiveFilters] = useState({
        region: [],
        gender: [],
        ageRange: [],
        category: [],
        tags: [],
        paymentMethod: [],
        startDate: '',
        endDate: ''
    });
    const [filterOptions, setFilterOptions] = useState({
        regions: [],
        genders: [],
        ageRanges: [],
        categories: [],
        tags: [],
        paymentMethods: []
    });

    // Sort state
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });

    // Load filter options on mount
    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const response = await fetchFilterOptions();
                if (response.success && response.filters) {
                    setFilterOptions(response.filters);
                }
            } catch (err) {
                console.error('Failed to load filter options:', err);
            }
        };

        loadFilterOptions();
    }, []);

    // Fetch transactions whenever search, filters, sort, or page changes
    useEffect(() => {
        const loadTransactions = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = {
                    search: debouncedSearch,
                    ...activeFilters,
                    sortBy,
                    sortOrder,
                    page: currentPage,
                    limit: 10
                };

                const response = await fetchTransactions(params);

                if (response.success) {
                    setTransactions(response.data || []);
                    setPagination(response.pagination || {});
                }
            } catch (err) {
                setError(err.message);
                console.error('Failed to load transactions:', err);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [debouncedSearch, activeFilters, sortBy, sortOrder, currentPage]);

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, activeFilters, sortBy, sortOrder]);

    // Handlers
    const handleSearchChange = (value) => {
        setSearchQuery(value);
    };

    const handleSearchClear = () => {
        setSearchQuery('');
    };

    const handleFilterChange = (filterType, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleClearAllFilters = () => {
        setActiveFilters({
            region: [],
            gender: [],
            ageRange: [],
            category: [],
            tags: [],
            paymentMethod: [],
            startDate: '',
            endDate: ''
        });
        setSearchQuery('');
    };

    const handleSortChange = (newSortBy, newSortOrder) => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <DynamicBackground />
            <Header />

            <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
                {/* Search Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }} className="animate-fade-in">
                    <SearchBar
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onClear={handleSearchClear}
                    />
                </div>

                {/* Filter Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }} className="animate-fade-in">
                    <FilterPanel
                        filters={activeFilters}
                        activeFilters={activeFilters}
                        onFilterChange={handleFilterChange}
                        onClearAll={handleClearAllFilters}
                        filterOptions={filterOptions}
                    />
                </div>

                {/* Controls Section */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-lg)',
                        flexWrap: 'wrap',
                        gap: 'var(--spacing-md)'
                    }}
                    className="animate-fade-in"
                >
                    <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                        {loading ? 'Loading...' : `${pagination.totalItems || 0} transactions found`}
                    </div>
                    <SortDropdown
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            padding: 'var(--spacing-lg)',
                            background: 'rgba(245, 101, 101, 0.1)',
                            border: '1px solid rgba(245, 101, 101, 0.3)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error)',
                            marginBottom: 'var(--spacing-lg)'
                        }}
                    >
                        Error: {error}
                    </div>
                )}

                {/* Table Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }} className="animate-fade-in">
                    <TransactionTable transactions={transactions} loading={loading} />
                </div>

                {/* Pagination Section */}
                {!loading && transactions.length > 0 && (
                    <div className="animate-fade-in">
                        <Pagination
                            currentPage={pagination.currentPage || 1}
                            totalPages={pagination.totalPages || 1}
                            totalItems={pagination.totalItems || 0}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </main>
        </>
    );
}
