
import React from 'react';
import './ThreeDBackground.css';

export const ThreeDBackground: React.FC = React.memo(() => {
    return (
        <div className="three-d-bg">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="grid-plane"></div>
        </div>
    );
});
