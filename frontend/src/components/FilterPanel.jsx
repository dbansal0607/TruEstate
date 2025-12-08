import React from 'react';
import '../styles/components.css';

export default function FilterPanel({ filters, activeFilters, onFilterChange, onClearAll, filterOptions }) {
    const handleMultiSelectChange = (filterType, value) => {
        const currentValues = activeFilters[filterType] || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];

        onFilterChange(filterType, newValues);
    };

    const removeFilter = (filterType, value) => {
        const currentValues = activeFilters[filterType] || [];
        onFilterChange(filterType, currentValues.filter(v => v !== value));
    };

    const hasActiveFilters = Object.values(activeFilters).some(arr => arr && arr.length > 0);

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h3 className="filter-title">Filters</h3>
                {hasActiveFilters && (
                    <button className="filter-clear" onClick={onClearAll}>
                        Clear All
                    </button>
                )}
            </div>

            <div className="filter-grid">
                <div className="filter-group">
                    <label className="filter-label">Customer Region</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('region', e.target.value)}
                    >
                        <option value="">Select region...</option>
                        {filterOptions.regions?.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Gender</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('gender', e.target.value)}
                    >
                        <option value="">Select gender...</option>
                        {filterOptions.genders?.map(gender => (
                            <option key={gender} value={gender}>{gender}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Age Range</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('ageRange', e.target.value)}
                    >
                        <option value="">Select age range...</option>
                        {filterOptions.ageRanges?.map(range => (
                            <option key={range} value={range}>{range}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Product Category</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('category', e.target.value)}
                    >
                        <option value="">Select category...</option>
                        {filterOptions.categories?.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Tags</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('tags', e.target.value)}
                    >
                        <option value="">Select tags...</option>
                        {filterOptions.tags?.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Payment Method</label>
                    <select
                        className="filter-select"
                        value=""
                        onChange={(e) => handleMultiSelectChange('paymentMethod', e.target.value)}
                    >
                        <option value="">Select payment...</option>
                        {filterOptions.paymentMethods?.map(method => (
                            <option key={method} value={method}>{method}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Start Date</label>
                    <input
                        type="date"
                        className="filter-select"
                        value={activeFilters.startDate || ''}
                        onChange={(e) => onFilterChange('startDate', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">End Date</label>
                    <input
                        type="date"
                        className="filter-select"
                        value={activeFilters.endDate || ''}
                        onChange={(e) => onFilterChange('endDate', e.target.value)}
                    />
                </div>
            </div>

            {hasActiveFilters && (
                <div className="filter-badges">
                    {Object.entries(activeFilters).map(([filterType, values]) => {
                        if (filterType === 'startDate' || filterType === 'endDate') {
                            if (values) {
                                return (
                                    <div key={filterType} className="filter-badge">
                                        <span>{filterType === 'startDate' ? 'From' : 'To'}: {values}</span>
                                        <button
                                            className="filter-badge-remove"
                                            onClick={() => onFilterChange(filterType, '')}
                                            aria-label="Remove filter"
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            }
                        } else if (Array.isArray(values)) {
                            return values.map(value => (
                                <div key={`${filterType}-${value}`} className="filter-badge">
                                    <span>{value}</span>
                                    <button
                                        className="filter-badge-remove"
                                        onClick={() => removeFilter(filterType, value)}
                                        aria-label="Remove filter"
                                    >
                                        ×
                                    </button>
                                </div>
                            ));
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );
}
