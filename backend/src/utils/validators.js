/**
 * Request validation utilities
 */

export function validatePaginationParams(page, limit) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    return {
        page: Math.max(1, pageNum),
        limit: Math.max(1, Math.min(100, limitNum)) // Max 100 items per page
    };
}

export function validateSortParams(sortBy, sortOrder) {
    const validSortFields = ['date', 'quantity', 'customerName'];
    const validSortOrders = ['asc', 'desc'];

    return {
        sortBy: validSortFields.includes(sortBy) ? sortBy : 'date',
        sortOrder: validSortOrders.includes(sortOrder) ? sortOrder : 'desc'
    };
}

export function validateDateRange(startDate, endDate) {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && isNaN(start.getTime())) return { startDate: null, endDate: null };
    if (end && isNaN(end.getTime())) return { startDate: null, endDate: null };

    return { startDate: start, endDate: end };
}

export function parseArrayParam(param) {
    if (!param) return [];
    if (Array.isArray(param)) return param;
    return param.split(',').map(item => item.trim()).filter(Boolean);
}
