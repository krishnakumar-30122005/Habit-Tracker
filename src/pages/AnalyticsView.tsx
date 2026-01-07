import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import clsx from 'clsx';
import { generateInsights } from '../features/insights/InsightEngine';
import { ArrowUpRight, Activity, Target, Zap, Clock, Download } from 'lucide-react';
import './AnalyticsView.css';

export const AnalyticsView: React.FC = () => {
    const { habits, logs } = useHabits();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

    const activeHabits = habits.filter(h => !h.archived);

    // --- Data Processing ---

    // 1. KPI Calculations
    const kpis = useMemo(() => {
        const totalActive = activeHabits.length;
        const totalLogs = logs.filter(l => l.completed).length;

        // Completion Rate (All time vs Last Week)
        // Simple calculation for demo
        const completionRate = totalActive > 0 ? Math.round((totalLogs / (totalActive * 30)) * 100) : 0;

        const maxStreak = Math.max(...habits.map(h => h.streak), 0);

        return {
            totalActive,
            totalLogs,
            completionRate: Math.min(completionRate, 100),
            maxStreak
        };
    }, [habits, logs]);

    // 2. Trend Data (Area Chart)
    const trendData = useMemo(() => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const today = new Date();
        const interval = eachDayOfInterval({ start: subDays(today, days - 1), end: today });

        return interval.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const completedCount = activeHabits.filter(h =>
                logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed)
            ).length;

            // Calculate rate for that day
            const dailyRate = activeHabits.length > 0 ? (completedCount / activeHabits.length) * 100 : 0;

            return {
                date: format(day, 'MMM dd'),
                value: Math.round(dailyRate),
                count: completedCount
            };
        });
    }, [activeHabits, logs, timeRange]);

    // 3. Category Data (Pie)
    const categoryData = useMemo(() => {
        const counts = activeHabits.reduce((acc, habit) => {
            acc[habit.category] = (acc[habit.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activeHabits]);

    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

    // 4. Insights
    const insights = useMemo(() => generateInsights(habits, logs), [habits, logs]);

    return (
        <div className="analytics-dashboard">
            {/* Header Controls */}
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Performance Analytics</h1>
                    <p className="dashboard-subtitle">Track your consistency and growth metrics</p>
                </div>

                <div className="dashboard-actions">
                    <div className="time-selector">
                        <button className={clsx("time-btn", timeRange === '7d' && "active")} onClick={() => setTimeRange('7d')}>7 Days</button>
                        <button className={clsx("time-btn", timeRange === '30d' && "active")} onClick={() => setTimeRange('30d')}>30 Days</button>
                        <button className={clsx("time-btn", timeRange === '90d' && "active")} onClick={() => setTimeRange('90d')}>90 Days</button>
                    </div>
                    <button className="action-btn-icon" title="Export Data">
                        <Download size={18} />
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper blue">
                        <Activity size={20} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Completion Rate</span>
                        <div className="kpi-value-row">
                            <span className="kpi-value">{kpis.completionRate}%</span>
                            <span className="kpi-trend positive">
                                <ArrowUpRight size={16} /> 2.4%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon-wrapper purple">
                        <Target size={20} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Active Habits</span>
                        <div className="kpi-value-row">
                            <span className="kpi-value">{kpis.totalActive}</span>
                            <span className="kpi-trend neutral">
                                - 0
                            </span>
                        </div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon-wrapper orange">
                        <Zap size={20} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Best Streak</span>
                        <div className="kpi-value-row">
                            <span className="kpi-value">{kpis.maxStreak}</span>
                            <span className="kpi-unit">days</span>
                        </div>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon-wrapper green">
                        <Clock size={20} />
                    </div>
                    <div className="kpi-content">
                        <span className="kpi-label">Total Logs</span>
                        <div className="kpi-value-row">
                            <span className="kpi-value">{kpis.totalLogs}</span>
                            <span className="kpi-trend positive">
                                <ArrowUpRight size={16} /> 12
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Trend Chart */}
            <div className="chart-section full-width">
                <div className="chart-header">
                    <h3>Consistency Trend</h3>
                    <div className="chart-legend">
                        <span className="legend-dot primary"></span> Daily Completion %
                    </div>
                </div>
                <div className="chart-body large-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-dim)" vertical={false} />
                            <XAxis dataKey="date" stroke="var(--text-2)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="var(--text-2)" fontSize={12} tickLine={false} axisLine={false} dx={-10} unit="%" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-dim)', borderRadius: '8px', color: 'var(--text-1)' }}
                                itemStyle={{ color: 'var(--text-1)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts Grid */}
            <div className="columns-grid">
                {/* Insights Panel */}
                <div className="chart-section">
                    <div className="chart-header">
                        <h3>AI Insights & Suggestions</h3>
                    </div>
                    <div className="insights-list-scroll">
                        {insights.length > 0 ? insights.map(insight => (
                            <div key={insight.id} className={clsx("insight-row", insight.type)}>
                                <div className="insight-indicator"></div>
                                <p>{insight.text}</p>
                            </div>
                        )) : (
                            <div className="empty-insights">
                                <p>Keep tracking to generate insights...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="chart-section">
                    <div className="chart-header">
                        <h3>Distribution by Category</h3>
                    </div>
                    <div className="chart-body medium-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--surface-1)', border: '1px solid var(--border-dim)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
