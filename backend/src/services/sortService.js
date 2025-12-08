/**
 * Sort service - Sort by Date, Quantity, or Customer Name
 */

export function sortTransactions(transactions, sortBy, sortOrder) {
    const sorted = [...transactions]; // Create a copy to avoid mutating original

    sorted.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'date':
                const dateA = new Date(a.date || 0);
                const dateB = new Date(b.date || 0);
                comparison = dateA - dateB;
                break;

            case 'quantity':
                comparison = (a.quantity || 0) - (b.quantity || 0);
                break;

            case 'customerName':
                const nameA = (a.customerName || '').toLowerCase();
                const nameB = (b.customerName || '').toLowerCase();
                comparison = nameA.localeCompare(nameB);
                break;

            default:
                // Default to date sorting
                const defaultDateA = new Date(a.date || 0);
                const defaultDateB = new Date(b.date || 0);
                comparison = defaultDateA - defaultDateB;
        }

        // Apply sort order (asc or desc)
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
}
