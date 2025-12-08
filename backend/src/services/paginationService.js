/**
 * Pagination service - Handle pagination with state retention
 */

export function paginateTransactions(transactions, page, limit) {
    const totalItems = transactions.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Ensure page is within valid range
    const currentPage = Math.min(Math.max(1, page), totalPages || 1);

    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = transactions.slice(startIndex, endIndex);

    return {
        data: paginatedData,
        pagination: {
            currentPage,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1
        }
    };
}
