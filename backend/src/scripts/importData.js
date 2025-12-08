import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import Transaction from '../models/Transaction.js';
import { AGE_RANGES } from '../config/constants.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Import CSV data to MongoDB
 */
async function importData() {
    try {
        console.log('🚀 Starting data import...\n');

        // Connect to database
        await connectDatabase();

        // Clear existing data
        console.log('Clearing existing data...');
        await Transaction.deleteMany({});
        console.log('✓ Existing data cleared\n');

        // Get CSV file path
        const csvPath = process.env.CSV_FILE_PATH || '../truestate_assignment_dataset.csv';
        const projectRoot = path.resolve(__dirname, '../../../');
        const absolutePath = path.join(projectRoot, csvPath);

        console.log(`Loading data from: ${absolutePath}\n`);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(`CSV file not found at: ${absolutePath}`);
        }

        const transactions = [];
        let count = 0;
        const batchSize = 1000; // Insert in batches for better performance

        return new Promise((resolve, reject) => {
            fs.createReadStream(absolutePath)
                .pipe(csv())
                .on('data', (row) => {
                    const transaction = {
                        transactionId: row['Transaction ID']?.trim(),
                        date: new Date(row['Date']?.trim()),
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

                    transactions.push(transaction);
                    count++;

                    // Insert in batches
                    if (transactions.length >= batchSize) {
                        const batch = [...transactions];
                        transactions.length = 0;

                        Transaction.insertMany(batch, { ordered: false })
                            .then(() => {
                                console.log(`✓ Imported ${count} transactions...`);
                            })
                            .catch(err => {
                                console.error('Batch insert error:', err.message);
                            });
                    }
                })
                .on('end', async () => {
                    try {
                        // Insert remaining transactions
                        if (transactions.length > 0) {
                            await Transaction.insertMany(transactions, { ordered: false });
                        }

                        console.log(`\n✓ Data import completed!`);
                        console.log(`✓ Total transactions imported: ${count}`);

                        // Verify count
                        const dbCount = await Transaction.countDocuments();
                        console.log(`✓ Transactions in database: ${dbCount}\n`);

                        await disconnectDatabase();
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    } catch (error) {
        console.error('Import error:', error);
        await disconnectDatabase();
        process.exit(1);
    }
}

// Run import
importData()
    .then(() => {
        console.log('✓ Import script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import script failed:', error);
        process.exit(1);
    });
