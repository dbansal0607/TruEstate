import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    date: { type: Date, required: true, index: true },
    customerId: String,
    customerName: { type: String, index: true },
    phoneNumber: { type: String, index: true },
    gender: { type: String, index: true },
    age: Number,
    ageRange: { type: String, index: true },
    customerRegion: { type: String, index: true },
    customerType: String,
    productId: String,
    productName: String,
    brand: String,
    productCategory: { type: String, index: true },
    tags: { type: String, index: true },
    quantity: { type: Number, index: true },
    pricePerUnit: Number,
    discountPercentage: Number,
    totalAmount: Number,
    finalAmount: Number,
    paymentMethod: { type: String, index: true },
    orderStatus: String,
    deliveryType: String,
    storeId: String,
    storeLocation: String,
    salespersonId: String,
    employeeName: String
}, {
    collection: 'transactions',
    timestamps: false
});

// Compound indexes for common query patterns
transactionSchema.index({ customerName: 1, phoneNumber: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ customerRegion: 1, gender: 1, ageRange: 1 });
transactionSchema.index({ productCategory: 1, tags: 1, paymentMethod: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
