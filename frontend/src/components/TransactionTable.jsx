import React from 'react';
import { formatDate, formatCurrency, formatNumber } from '../utils/formatters.js';
import '../styles/components.css';

export default function TransactionTable({ transactions, loading }) {
    if (loading) {
        return (
            <div className="transaction-table-container">
                <div className="table-loading">
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="transaction-table-container">
                <div className="table-empty">
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ margin: '0 auto', opacity: 0.3 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>No transactions found</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Try adjusting your search or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className="transaction-table-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Region</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={transaction.transactionId || index} className="animate-fade-in">
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.customerName || '-'}</td>
                            <td>{transaction.phoneNumber || '-'}</td>
                            <td>{transaction.productName || '-'}</td>
                            <td>{transaction.productCategory || '-'}</td>
                            <td>{formatNumber(transaction.quantity)}</td>
                            <td>{formatCurrency(transaction.finalAmount)}</td>
                            <td>{transaction.paymentMethod || '-'}</td>
                            <td>{transaction.customerRegion || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
