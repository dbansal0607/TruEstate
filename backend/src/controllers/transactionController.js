import Transaction from '../models/Transaction.js';
import {
    validatePaginationParams,
    validateSortParams,
    validateDateRange,
    parseArrayParam
} from '../utils/validators.js';

/**
 * Get transactions with search, filter, sort, and pagination using MongoDB
 */
export async function getTransactions(req, res, next) {
    try {
        // Extract query parameters
        const {
            search,
            region,
            gender,
            ageRange,
            category,
            tags,
            paymentMethod,
            startDate,
            endDate,
            sortBy = 'date',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query;

        // Build MongoDB query
        const query = {};

        // Apply search (case-insensitive regex on customerName and phoneNumber)
        if (search) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { customerName: searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        // Apply filters with OR logic within same filter type
        if (region) {
            const regions = parseArrayParam(region);
            if (regions.length > 0) {
                query.customerRegion = { $in: regions };
            }
        }

        if (gender) {
            const genders = parseArrayParam(gender);
            if (genders.length > 0) {
                query.gender = { $in: genders };
            }
        }

        if (ageRange) {
            const ageRanges = parseArrayParam(ageRange);
            if (ageRanges.length > 0) {
                query.ageRange = { $in: ageRanges };
            }
        }

        if (category) {
            const categories = parseArrayParam(category);
            if (categories.length > 0) {
                query.productCategory = { $in: categories };
            }
        }

        if (tags) {
            const tagsList = parseArrayParam(tags);
            if (tagsList.length > 0) {
                query.tags = { $in: tagsList };
            }
        }

        if (paymentMethod) {
            const methods = parseArrayParam(paymentMethod);
            if (methods.length > 0) {
                query.paymentMethod = { $in: methods };
            }
        }

        // Apply date range filter
        const dateFilter = validateDateRange(startDate, endDate);
        if (dateFilter.startDate || dateFilter.endDate) {
            query.date = {};
            if (dateFilter.startDate) {
                query.date.$gte = dateFilter.startDate;
            }
            if (dateFilter.endDate) {
                query.date.$lte = dateFilter.endDate;
            }
        }

        // Validate and apply sorting
        const { sortBy: validSortBy, sortOrder: validSortOrder } = validateSortParams(sortBy, sortOrder);
        const sortField = validSortBy === 'customerName' ? 'customerName' : validSortBy;
        const sortDirection = validSortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortDirection };

        // Validate pagination params
        const { page: validPage, limit: validLimit } = validatePaginationParams(page, limit);
        const skip = (validPage - 1) * validLimit;

        // Execute query with pagination
        const [transactions, totalItems] = await Promise.all([
            Transaction.find(query)
                .sort(sort)
                .skip(skip)
                .limit(validLimit)
                .lean(), // Use lean() for better performance
            Transaction.countDocuments(query)
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalItems / validLimit);
        const hasNextPage = validPage < totalPages;
        const hasPreviousPage = validPage > 1;

        // Send response
        res.json({
            success: true,
            data: transactions,
            pagination: {
                currentPage: validPage,
                totalPages,
                totalItems,
                itemsPerPage: validLimit,
                hasNextPage,
                hasPreviousPage
            }
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get available filter options from MongoDB
 */
export async function getFilters(req, res, next) {
    try {
        // Get distinct values for each filter field
        const [regions, genders, ageRanges, categories, tagsList, paymentMethods] = await Promise.all([
            Transaction.distinct('customerRegion'),
            Transaction.distinct('gender'),
            Transaction.distinct('ageRange'),
            Transaction.distinct('productCategory'),
            Transaction.distinct('tags'),
            Transaction.distinct('paymentMethod')
        ]);

        // Sort arrays
        const options = {
            regions: regions.filter(Boolean).sort(),
            genders: genders.filter(Boolean).sort(),
            ageRanges: ageRanges.filter(Boolean).sort(),
            categories: categories.filter(Boolean).sort(),
            tags: tagsList.filter(Boolean).sort(),
            paymentMethods: paymentMethods.filter(Boolean).sort()
        };

        res.json({
            success: true,
            filters: options
        });
    } catch (error) {
        next(error);
    }
}
