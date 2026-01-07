import React, { useEffect } from 'react';
import { Trophy, X, Share2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import './LevelUpModal.css';

export const LevelUpModal: React.FC = () => {
    const { user, showLevelUp, closeLevelUp } = useAuth();

    useEffect(() => {
        if (showLevelUp) {
            // Trigger confetti explosion
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#a855f7', '#ec4899', '#ffffff']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#a855f7', '#ec4899', '#ffffff']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        }
    }, [showLevelUp]);

    if (!showLevelUp || !user) return null;

    return (
        <div className="levelup-overlay">
            <div className="levelup-card">
                <button className="close-btn" onClick={closeLevelUp}>
                    <X size={20} />
                </button>

                <div className="levelup-animation">
                    <div className="trophy-glow"></div>
                    <Trophy size={80} className="trophy-icon" />
                </div>

                <div className="levelup-content">
                    <h2 className="levelup-title">LEVEL UP!</h2>
                    <p className="levelup-label">You are now</p>
                    <div className="level-badge-large">
                        <span>Level {user.level}</span>
                    </div>
                    <p className="levelup-desc">Amazing consistency! You've unlocked new potential.</p>
                </div>

                <div className="levelup-footer">
                    <button className="share-btn">
                        <Share2 size={18} /> Share Achievement
                    </button>
                    <button className="continue-btn" onClick={closeLevelUp}>
                        Continue Journey
                    </button>
                </div>
            </div>
        </div>
    );
};
