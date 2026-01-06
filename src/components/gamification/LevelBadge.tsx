import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './LevelBadge.css';

const LevelBadge: React.FC = () => {
    const { user } = useAuth();

    if (!user) return null;

    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const levelProgress = user.xp - currentLevelXP;
    const percentage = Math.min(100, Math.max(0, (levelProgress / 100) * 100));

    return (
        <div className="level-badge-pill">
            <div className="level-info">
                <span className="level-label">LVL</span>
                <span className="level-value">{user.level}</span>
            </div>

            <div className="xp-track">
                <div className="xp-details">
                    <span className="xp-amount">{user.xp} XP</span>
                    <span className="xp-target">/ {nextLevelXP}</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LevelBadge;
