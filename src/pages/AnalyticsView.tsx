
import React from 'react';
import { useHabits } from '../context/HabitContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line,
    PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import clsx from 'clsx';
import { generateInsights } from '../features/insights/InsightEngine';
import './AnalyticsView.css';

export const AnalyticsView: React.FC = () => {
    const { habits, logs } = useHabits();

    // 1. Completion History (Last 14 days)
    const today = new Date();
    const last14Days = eachDayOfInterval({ start: subDays(today, 13), end: today });

    const activeHabits = habits.filter(h => !h.archived);

    const completionData = last14Days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const completedCount = activeHabits.filter(h =>
            logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed)
        ).length;

        return {
            date: format(day, 'MMM dd'),
            completed: completedCount,
            total: activeHabits.length
        };
    });

    // 2. Habit Consistency Leaderboard
    const habitStats = activeHabits.map(h => {
        const totalLogs = logs.filter(l => l.habitId === h.id && l.completed).length;
        return {
            name: h.title,
            count: totalLogs,
            streak: h.streak
        };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    // 3. Generate Insights
    const insights = React.useMemo(() => generateInsights(habits, logs), [habits, logs]);

    // 4. Category Distribution (Pie Chart)
    const categoryData = activeHabits.reduce((acc, habit) => {
        const cat = habit.category;
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
    const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];

    // 5. Day of Week Performance (Radar Chart)
    const dayPerformance = [0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayLogs = logs.filter(l => l.completed && new Date(l.date).getDay() === dayIndex).length;
        return {
            subject: dayNames[dayIndex],
            A: dayLogs,
            fullMark: 100 // Scale doesn't strictly matter
        };
    });

    return (
        <div className="analytics-view">
            <h2 className="analytics-title">Analytics Dashboard</h2>

            {insights.length > 0 && (
                <div className="insights-section">
                    <h3>Insights for You</h3>
                    <div className="insights-grid">
                        {insights.map(insight => (
                            <div key={insight.id} className={clsx("insight-card", insight.type)}>
                                {insight.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="chart-card heatmap-card">
                <h3>Yearly Consistency Heatmap</h3>
                <div className="heatmap-container">
                    {(() => {
                        const today = new Date();
                        const yearAgo = subDays(today, 364);
                        const days = eachDayOfInterval({ start: yearAgo, end: today });

                        return (
                            <div className="heatmap-grid">
                                {days.map(day => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const count = logs.filter(l => l.date === dateStr && l.completed).length;

                                    let intensity = 'level-0';
                                    if (count > 0) intensity = 'level-1';
                                    if (count > 2) intensity = 'level-2';
                                    if (count > 4) intensity = 'level-3';
                                    if (count > 7) intensity = 'level-4';

                                    return (
                                        <div
                                            key={dateStr}
                                            className={`heatmap-cell ${intensity}`}
                                            title={`${dateStr}: ${count} completions`}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Completion Trend (Last 14 Days)</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={completionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e36" />
                                <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} />
                                <YAxis stroke="#a3a3a3" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e36', borderRadius: '8px' }}
                                />
                                <Line type="monotone" dataKey="completed" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Top Habits by Consistency</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={habitStats} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2e36" horizontal={false} />
                                <XAxis type="number" stroke="#a3a3a3" fontSize={12} />
                                <YAxis dataKey="name" type="category" width={100} stroke="#a3a3a3" fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e36', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="var(--secondary)" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Habits by Category</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e36', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Weekly Focus</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dayPerformance}>
                                <PolarGrid stroke="#2a2e36" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar
                                    name="Completions"
                                    dataKey="A"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.4}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#181b21', border: '1px solid #2a2e36', borderRadius: '8px' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="stats-row">
                <div className="stat-card">
                    <span className="stat-label">Total Active Habits</span>
                    <span className="stat-value">{activeHabits.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Total Completions</span>
                    <span className="stat-value">{logs.filter(l => l.completed).length}</span>
                </div>
                <div className="stat-card highlight">
                    <span className="stat-label">Longest Streak</span>
                    <span className="stat-value">{Math.max(...habits.map(h => h.streak), 0)} 🔥</span>
                </div>
            </div>
        </div>
    );
};
