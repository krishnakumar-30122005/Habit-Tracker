
import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format, startOfWeek, addDays, subWeeks, addWeeks, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import clsx from 'clsx';
import './WeeklyView.css';

export const WeeklyView: React.FC = () => {
    const { habits, logs, toggleHabitCompletion } = useHabits();
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Monday start

    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

    const isCompleted = (habitId: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return logs.some(l => l.habitId === habitId && l.date === dateStr && l.completed);
    };

    const handleToggle = (habitId: string, date: Date) => {
        toggleHabitCompletion(habitId, format(date, 'yyyy-MM-dd'));
    };

    const activeHabits = habits.filter(h => !h.archived);

    return (
        <div className="weekly-view">
            <div className="week-header">
                <button className="icon-btn" onClick={() => setCurrentWeekStart(prev => subWeeks(prev, 1))}>
                    <ChevronLeft size={20} />
                </button>
                <span className="week-title">
                    {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
                </span>
                <button className="icon-btn" onClick={() => setCurrentWeekStart(prev => addWeeks(prev, 1))}>
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="habit-grid">
                <div className="grid-header-row">
                    <div className="grid-cell habit-name-header">Habit</div>
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className={clsx("grid-cell day-header", { today: isSameDay(day, new Date()) })}>
                            <span className="day-name">{format(day, 'EEE')}</span>
                            <span className="day-num">{format(day, 'd')}</span>
                        </div>
                    ))}
                    <div className="grid-cell score-header">Score</div>
                </div>

                {activeHabits.map(habit => {
                    const weeklyCompletions = weekDays.filter(d => isCompleted(habit.id, d)).length;
                    const weeklyScore = Math.round((weeklyCompletions / 7) * 100);

                    return (
                        <div key={habit.id} className="grid-row">
                            <div className="grid-cell habit-name-cell">
                                <span className={clsx("bar-indicator", habit.category)}></span>
                                {habit.title}
                            </div>
                            {weekDays.map(day => {
                                const completed = isCompleted(habit.id, day);
                                return (
                                    <div key={day.toISOString()} className="grid-cell check-cell">
                                        <button
                                            className={clsx("grid-check-btn", { completed })}
                                            onClick={() => handleToggle(habit.id, day)}
                                        >
                                            {completed && <Check size={16} strokeWidth={3} />}
                                        </button>
                                    </div>
                                );
                            })}
                            <div className="grid-cell score-cell">
                                <span className={clsx("score-badge", {
                                    high: weeklyScore >= 80,
                                    med: weeklyScore >= 50 && weeklyScore < 80,
                                    low: weeklyScore < 50
                                })}>
                                    {weeklyScore}%
                                </span>
                            </div>
                        </div>
                    );
                })}

                {activeHabits.length === 0 && (
                    <div className="empty-grid-message">No active habits.</div>
                )}
            </div>
        </div>
    );
};
