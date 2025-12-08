import React from 'react';
import '../styles/components.css';

export default function DynamicBackground() {
    return (
        <div className="dynamic-background">
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>
            <div className="bg-orb bg-orb-3"></div>
        </div>
    );
}
