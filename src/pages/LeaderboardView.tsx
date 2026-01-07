import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trophy, User } from 'lucide-react';
import './LeaderboardView.css';

interface LeaderboardUser {
    _id: string;
    name: string;
    xp: number;
    level: number;
}

const LeaderboardView: React.FC = () => {
    const { user, token } = useAuth();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/auth/leaderboard', {
                    headers: { 'x-auth-token': token || '' }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error("Failed to fetch leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchLeaderboard();
    }, [token]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <img src="/assets/3d/gold.png" alt="Gold" className="rank-medal" />;
            case 1: return <img src="/assets/3d/silver.png" alt="Silver" className="rank-medal" />;
            case 2: return <img src="/assets/3d/bronze.png" alt="Bronze" className="rank-medal" />;
            default: return <span className="rank-number">#{index + 1}</span>;
        }
    };

    if (loading) return <div className="loading-state">Loading rankings...</div>;

    return (
        <div className="leaderboard-container">
            <div className="leaderboard-header">
                <div className="header-icon-bg">
                    <Trophy size={32} className="header-icon" />
                </div>
                <h2>Global Leaderboard</h2>
                <p>Top {users.length} Habits Warriors</p>
            </div>

            <div className="ranking-list">
                {users.map((u, index) => {
                    const isCurrentUser = u._id === user?._id;
                    return (
                        <div key={u._id} className={`ranking-item ${isCurrentUser ? 'current-user' : ''}`}>
                            <div className="rank-pos">
                                {getRankIcon(index)}
                            </div>

                            <div className="rank-user">
                                <div className="user-avatar">
                                    <User size={16} />
                                </div>
                                <div className="user-info">
                                    <span className="user-name">{u.name} {isCurrentUser && '(You)'}</span>
                                    <span className="user-level-label">Level {u.level}</span>
                                </div>
                            </div>

                            <div className="rank-xp">
                                <span className="xp-val">{u.xp}</span>
                                <span className="xp-label">XP</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeaderboardView;
