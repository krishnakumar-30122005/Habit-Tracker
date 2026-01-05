
import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import './MonthlyView.css';

export const MonthlyView: React.FC = () => {
    const { habits, logs } = useHabits();
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const startDate = startOfMonth(currentMonth);
    const endDate = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

    // Grid padding for start of month alignment
    const startDayOfWeek = getDay(startDate); // 0 = Sunday
    const paddingDays = Array.from({ length: startDayOfWeek }, (_, i) => i);

    const activeHabits = habits.filter(h => !h.archived);

    // Calculate daily scores
    const getDailyScore = (date: Date) => {
        if (activeHabits.length === 0) return 0;
        const dateStr = format(date, 'yyyy-MM-dd');
        const completedCount = activeHabits.filter(h =>
            logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed)
        ).length;
        return (completedCount / activeHabits.length) * 100;
    };

    return (
        <div className="monthly-view">
            <div className="month-header">
                <button className="icon-btn" onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}>
                    <ChevronLeft size={20} />
                </button>
                <span className="month-title">
                    {format(currentMonth, 'MMMM yyyy')}
                </span>
                <button className="icon-btn" onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}>
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="calendar-grid">
                <div className="calendar-days-header">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="calendar-header-cell">{d}</div>
                    ))}
                </div>

                <div className="calendar-body">
                    {paddingDays.map(d => (
                        <div key={`pad-${d}`} className="calendar-cell empty"></div>
                    ))}

                    {daysInMonth.map(day => {
                        const score = getDailyScore(day);
                        const isToday = isSameDay(day, new Date());

                        let intensityClass = 'intensity-0';
                        if (score > 0) intensityClass = 'intensity-1';
                        if (score >= 40) intensityClass = 'intensity-2';
                        if (score >= 70) intensityClass = 'intensity-3';
                        if (score === 100) intensityClass = 'intensity-4';

                        return (
                            <div key={day.toISOString()} className={clsx('calendar-cell', intensityClass, { today: isToday })}>
                                <div className="date-number">{format(day, 'd')}</div>
                                <div className="score-indicator">
                                    {score > 0 && <span>{Math.round(score)}%</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="legend">
                <span>Less</span>
                <div className="legend-item intensity-0"></div>
                <div className="legend-item intensity-1"></div>
                <div className="legend-item intensity-2"></div>
                <div className="legend-item intensity-3"></div>
                <div className="legend-item intensity-4"></div>
                <span>More</span>
            </div>
        </div>
    );
};
