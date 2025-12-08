import express from 'express';
import { getTransactions, getFilters } from '../controllers/transactionController.js';

const router = express.Router();

// Get transactions with search, filter, sort, and pagination
router.get('/transactions', getTransactions);

// Get available filter options
router.get('/filters/options', getFilters);

export default router;
