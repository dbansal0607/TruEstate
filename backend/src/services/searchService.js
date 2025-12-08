/**
 * Search service - Full-text search on Customer Name and Phone Number
 */

export function searchTransactions(transactions, searchQuery) {
    if (!searchQuery || searchQuery.trim() === '') {
        return transactions;
    }

    const query = searchQuery.toLowerCase().trim();

    return transactions.filter(transaction => {
        const customerName = (transaction.customerName || '').toLowerCase();
        const phoneNumber = (transaction.phoneNumber || '').toLowerCase();

        return customerName.includes(query) || phoneNumber.includes(query);
    });
}
