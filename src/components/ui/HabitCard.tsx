
import React from 'react';
import { Check, Flame, Clock, Trash2, Edit2 } from 'lucide-react';
import type { Habit } from '../../types';
import clsx from 'clsx';
import { use3DTilt } from '../../hooks/use3DTilt';
import './HabitCard.css';

interface HabitCardProps {
    habit: Habit;
    completed: boolean;
    onToggle: () => void;
    onEdit: (habit: Habit) => void;
    onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, completed, onToggle, onEdit, onDelete }) => {
    const { style, onMouseMove, onMouseLeave } = use3DTilt(10);

    return (
        <div
            className={clsx("habit-card", { completed })}
            style={style}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div className="habit-content">
                <div className="habit-header">
                    <span className={clsx("category-badge", habit.category)}>{habit.category}</span>
                    <div className="streak-indicator">
                        <Flame size={14} className={habit.streak > 0 ? 'active-flame' : ''} />
                        <span>{habit.streak} day streak</span>
                    </div>
                </div>

                <div className="title-row">
                    <h3 className="habit-title">{habit.title}</h3>
                    <div className="habit-actions">
                        <button className="action-icon-btn edit" onClick={() => onEdit(habit)} title="Edit">
                            <Edit2 size={14} />
                        </button>
                        <button className="action-icon-btn delete" onClick={() => onDelete(habit.id)} title="Delete">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {habit.timeOfDay !== 'anytime' && (
                    <div className="habit-meta">
                        <Clock size={14} />
                        <span>{habit.timeOfDay}</span>
                    </div>
                )}
            </div>

            <button
                className={clsx("check-btn", { completed })}
                onClick={onToggle}
                aria-label={`Mark ${habit.title} as ${completed ? 'incomplete' : 'complete'}`}
            >
                <Check size={24} strokeWidth={3} />
            </button>
        </div>
    );
};
