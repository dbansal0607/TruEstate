import React from 'react';
import '../styles/components.css';

export default function Header() {
    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <h1 className="brand-name">TruEstate</h1>
                    <span className="text-secondary" style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                        Sales Management System
                    </span>
                </div>
            </div>
        </header>
    );
}
