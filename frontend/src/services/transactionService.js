import apiClient from './api.js';

/**
 * Fetch transactions with filters, search, sort, and pagination
 */
export async function fetchTransactions(params = {}) {
    const queryParams = new URLSearchParams();

    // Add search
    if (params.search) {
        queryParams.append('search', params.search);
    }

    // Add filters (arrays)
    if (params.region && params.region.length > 0) {
        queryParams.append('region', params.region.join(','));
    }
    if (params.gender && params.gender.length > 0) {
        queryParams.append('gender', params.gender.join(','));
    }
    if (params.ageRange && params.ageRange.length > 0) {
        queryParams.append('ageRange', params.ageRange.join(','));
    }
    if (params.category && params.category.length > 0) {
        queryParams.append('category', params.category.join(','));
    }
    if (params.tags && params.tags.length > 0) {
        queryParams.append('tags', params.tags.join(','));
    }
    if (params.paymentMethod && params.paymentMethod.length > 0) {
        queryParams.append('paymentMethod', params.paymentMethod.join(','));
    }

    // Add date range
    if (params.startDate) {
        queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
        queryParams.append('endDate', params.endDate);
    }

    // Add sorting
    if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
    }

    // Add pagination
    if (params.page) {
        queryParams.append('page', params.page);
    }
    if (params.limit) {
        queryParams.append('limit', params.limit);
    }

    const response = await apiClient.get(`/transactions?${queryParams.toString()}`);
    return response;
}

/**
 * Fetch available filter options
 */
export async function fetchFilterOptions() {
    const response = await apiClient.get('/filters/options');
    return response;
}
