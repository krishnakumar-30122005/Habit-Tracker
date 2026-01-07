import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowUpRight, ShieldAlert, Users, Zap, Award, Target, Activity } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import './AdminDashboard.css'; // Import explicit styling

interface UserData {
    _id: string;
    level: number;
    xp: number;
}

export const AdminDashboard: React.FC = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({ totalUsers: 0, totalXP: 0, avgLevel: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                headers: {
                    'x-auth-token': token || ''
                }
            });
            if (res.ok) {
                const data: UserData[] = await res.json();

                const totalXP = data.reduce((acc, curr) => acc + curr.xp, 0);
                const avgLevel = data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.level, 0) / data.length) : 0;

                setStats({
                    totalUsers: data.length,
                    totalXP,
                    avgLevel
                });
            } else {
                setError('Failed to fetch stats');
            }
        } catch (err) {
            setError('Error fetching stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;

    return (
        <div className="admin-dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1>Overview</h1>
                <p>Platform performance at a glance.</p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-2xl flex items-center gap-4">
                    <ShieldAlert size={24} />
                    <span className="text-lg">{error}</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {/* Users Card */}
                <div className="stat-card-custom">
                    <div className="stat-icon-wrapper icon-blue">
                        <Users size={24} />
                    </div>
                    <div className="stat-content">
                        <label>Total Users</label>
                        <h2>{stats.totalUsers}</h2>
                    </div>
                    <div className="stat-badge badge-green">
                        <ArrowUpRight size={16} /> 12% Growth
                    </div>
                </div>

                {/* XP Card */}
                <div className="stat-card-custom">
                    <div className="stat-icon-wrapper icon-purple">
                        <Zap size={24} />
                    </div>
                    <div className="stat-content">
                        <label>Total XP</label>
                        <h2>{stats.totalXP.toLocaleString()}</h2>
                    </div>
                    <div className="stat-badge badge-purple">
                        <Activity size={16} /> High Activity
                    </div>
                </div>

                {/* Level Card */}
                <div className="stat-card-custom">
                    <div className="stat-icon-wrapper icon-amber">
                        <Award size={24} />
                    </div>
                    <div className="stat-content">
                        <label>Average Level</label>
                        <h2>{stats.avgLevel}</h2>
                    </div>
                    <div className="stat-badge badge-amber">
                        <Target size={16} /> Consistent
                    </div>
                </div>
            </div>

            {/* Empty State / Placeholder for Chart */}
            <div className="dashboard-placeholder">
                <Activity size={48} style={{ opacity: 0.2 }} />
                <p>Detailed analytics visualization coming soon</p>
            </div>
        </div>
    );
};
