import React, { useState } from 'react';
import '../styles/components.css';

export default function SortDropdown({ sortBy, sortOrder, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'date', label: 'Date', orders: ['desc', 'asc'] },
        { value: 'quantity', label: 'Quantity', orders: ['desc', 'asc'] },
        { value: 'customerName', label: 'Customer Name', orders: ['asc', 'desc'] }
    ];

    const handleSortChange = (newSortBy, newSortOrder) => {
        onSortChange(newSortBy, newSortOrder);
        setIsOpen(false);
    };

    const currentSort = sortOptions.find(opt => opt.value === sortBy);
    const sortLabel = currentSort
        ? `${currentSort.label} (${sortOrder === 'asc' ? 'A-Z' : 'Z-A'})`
        : 'Sort by...';

    return (
        <div className="sort-dropdown">
            <button
                className="sort-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span>{sortLabel}</span>
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <>
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 999
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="sort-menu">
                        {sortOptions.map(option => (
                            <React.Fragment key={option.value}>
                                <button
                                    className={`sort-option ${sortBy === option.value && sortOrder === option.orders[0] ? 'active' : ''}`}
                                    onClick={() => handleSortChange(option.value, option.orders[0])}
                                >
                                    {option.label} ({option.orders[0] === 'asc' ? '↑ Ascending' : '↓ Descending'})
                                </button>
                                <button
                                    className={`sort-option ${sortBy === option.value && sortOrder === option.orders[1] ? 'active' : ''}`}
                                    onClick={() => handleSortChange(option.value, option.orders[1])}
                                >
                                    {option.label} ({option.orders[1] === 'asc' ? '↑ Ascending' : '↓ Descending'})
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
