/**
 * Filter service - Multi-select filtering with AND/OR logic
 */

export function filterTransactions(transactions, filters) {
    let filtered = transactions;

    // Filter by Customer Region (OR logic - match any selected region)
    if (filters.region && filters.region.length > 0) {
        filtered = filtered.filter(t =>
            filters.region.includes(t.customerRegion)
        );
    }

    // Filter by Gender (OR logic - match any selected gender)
    if (filters.gender && filters.gender.length > 0) {
        filtered = filtered.filter(t =>
            filters.gender.includes(t.gender)
        );
    }

    // Filter by Age Range (OR logic - match any selected age range)
    if (filters.ageRange && filters.ageRange.length > 0) {
        filtered = filtered.filter(t =>
            t.ageRange && filters.ageRange.includes(t.ageRange)
        );
    }

    // Filter by Product Category (OR logic - match any selected category)
    if (filters.category && filters.category.length > 0) {
        filtered = filtered.filter(t =>
            filters.category.includes(t.productCategory)
        );
    }

    // Filter by Tags (OR logic - match any selected tag)
    if (filters.tags && filters.tags.length > 0) {
        filtered = filtered.filter(t =>
            filters.tags.includes(t.tags)
        );
    }

    // Filter by Payment Method (OR logic - match any selected payment method)
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
        filtered = filtered.filter(t =>
            filters.paymentMethod.includes(t.paymentMethod)
        );
    }

    // Filter by Date Range (AND logic - must be within range)
    if (filters.startDate || filters.endDate) {
        filtered = filtered.filter(t => {
            if (!t.date) return false;

            const transactionDate = new Date(t.date);

            if (filters.startDate && transactionDate < filters.startDate) {
                return false;
            }

            if (filters.endDate && transactionDate > filters.endDate) {
                return false;
            }

            return true;
        });
    }

    return filtered;
}
