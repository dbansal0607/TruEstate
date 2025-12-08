import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export async function connectDatabase() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/truestate';

        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log('✓ Connected to MongoDB');
        console.log(`✓ Database: ${mongoose.connection.name}`);

        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase() {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
}
