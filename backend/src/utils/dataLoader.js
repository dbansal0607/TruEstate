import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { AGE_RANGES } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let transactionsData = [];
let filterOptions = {};

/**
 * Get age range bucket for a given age
 */
function getAgeRange(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return null;

    for (const [range, { min, max }] of Object.entries(AGE_RANGES)) {
        if (ageNum >= min && ageNum <= max) {
            return range;
        }
    }
    return null;
}

/**
 * Load and parse CSV data
 */
export async function loadData(csvFilePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        const uniqueValues = {
            regions: new Set(),
            genders: new Set(),
            ageRanges: new Set(),
            categories: new Set(),
            tags: new Set(),
            paymentMethods: new Set()
        };

        // Resolve from TruEstate root (3 levels up from backend/src/utils/)
        const projectRoot = path.resolve(__dirname, '../../../');
        const absolutePath = path.join(projectRoot, csvFilePath);

        console.log(`Loading data from: ${absolutePath}`);

        fs.createReadStream(absolutePath)
            .pipe(csv())
            .on('data', (row) => {
                // Parse and clean the data
                const transaction = {
                    transactionId: row['Transaction ID']?.trim(),
                    date: row['Date']?.trim(),
                    customerId: row['Customer ID']?.trim(),
                    customerName: row['Customer Name']?.trim(),
                    phoneNumber: row['Phone Number']?.trim(),
                    gender: row['Gender']?.trim(),
                    age: parseInt(row['Age']) || 0,
                    ageRange: getAgeRange(row['Age']),
                    customerRegion: row['Customer Region']?.trim(),
                    customerType: row['Customer Type']?.trim(),
                    productId: row['Product ID']?.trim(),
                    productName: row['Product Name']?.trim(),
                    brand: row['Brand']?.trim(),
                    productCategory: row['Product Category']?.trim(),
                    tags: row['Tags']?.trim(),
                    quantity: parseInt(row['Quantity']) || 0,
                    pricePerUnit: parseFloat(row['Price per Unit']) || 0,
                    discountPercentage: parseFloat(row['Discount Percentage']) || 0,
                    totalAmount: parseFloat(row['Total Amount']) || 0,
                    finalAmount: parseFloat(row['Final Amount']) || 0,
                    paymentMethod: row['Payment Method']?.trim(),
                    orderStatus: row['Order Status']?.trim(),
                    deliveryType: row['Delivery Type']?.trim(),
                    storeId: row['Store ID']?.trim(),
                    storeLocation: row['Store Location']?.trim(),
                    salespersonId: row['Salesperson ID']?.trim(),
                    employeeName: row['Employee Name']?.trim()
                };

                results.push(transaction);

                // Collect unique values for filters
                if (transaction.customerRegion) uniqueValues.regions.add(transaction.customerRegion);
                if (transaction.gender) uniqueValues.genders.add(transaction.gender);
                if (transaction.ageRange) uniqueValues.ageRanges.add(transaction.ageRange);
                if (transaction.productCategory) uniqueValues.categories.add(transaction.productCategory);
                if (transaction.tags) uniqueValues.tags.add(transaction.tags);
                if (transaction.paymentMethod) uniqueValues.paymentMethods.add(transaction.paymentMethod);
            })
            .on('end', () => {
                transactionsData = results;

                // Convert sets to sorted arrays
                filterOptions = {
                    regions: Array.from(uniqueValues.regions).sort(),
                    genders: Array.from(uniqueValues.genders).sort(),
                    ageRanges: Object.keys(AGE_RANGES),
                    categories: Array.from(uniqueValues.categories).sort(),
                    tags: Array.from(uniqueValues.tags).sort(),
                    paymentMethods: Array.from(uniqueValues.paymentMethods).sort()
                };

                console.log(`✓ Loaded ${transactionsData.length} transactions`);
                console.log(`✓ Filter options prepared`);
                resolve();
            })
            .on('error', (error) => {
                console.error('Error loading CSV:', error);
                reject(error);
            });
    });
}

/**
 * Get all transactions
 */
export function getAllTransactions() {
    return transactionsData;
}

/**
 * Get filter options
 */
export function getFilterOptions() {
    return filterOptions;
}
