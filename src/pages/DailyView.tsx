
import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { HabitCard } from '../components/ui/HabitCard';
import { Modal } from '../components/ui/Modal';
import { HabitForm } from '../features/habits/HabitForm';
import { TodoList } from '../components/ui/TodoList';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Habit } from '../types';
import './DailyView.css';

export const DailyView: React.FC = () => {
    const { habits, toggleHabitCompletion, deleteHabit } = useHabits();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'habits' | 'todos'>('habits');

    const activeHabits = habits.filter(h => !h.archived);
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // Sort: Time of day
    const sortedHabits = [...activeHabits].sort((a, b) => {
        const order = { morning: 0, afternoon: 1, evening: 2, anytime: 3 };
        return order[a.timeOfDay] - order[b.timeOfDay];
    });

    const isToday = isSameDay(selectedDate, new Date());
    const { logs } = useHabits();
    const completedCount = sortedHabits.filter(h =>
        logs.some(l => l.habitId === h.id && l.date === dateStr && l.completed)
    ).length;

    const progress = sortedHabits.length > 0 ? (completedCount / sortedHabits.length) * 100 : 0;

    const handleEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this habit? All history will be lost.')) {
            deleteHabit(id);
        }
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditingHabit(undefined);
    };

    return (
        <div className="daily-view">
            <div className="daily-hero">
                <div className="hero-content">
                    <h1 className="hero-title">{isToday ? 'Today\'s Focus' : format(selectedDate, 'EEEE')}</h1>
                    <p className="hero-subtitle">{format(selectedDate, 'MMMM d, yyyy')}</p>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value">{completedCount}/{sortedHabits.length}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value">{Math.round(progress)}%</span>
                            <span className="stat-label">Progress</span>
                        </div>
                    </div>
                </div>

                <div className="hero-progress-ring">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                            cx="60" cy="60" r="54"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="8"
                            strokeDasharray="339.292"
                            strokeDashoffset={339.292 - (339.292 * progress) / 100}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                        />
                    </svg>
                    <div className="ring-content">
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>

            <div className="view-controls">
                <div className="view-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
                        onClick={() => setActiveTab('habits')}
                    >
                        Habits
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'todos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('todos')}
                    >
                        To-Do List
                    </button>
                </div>

                <div className="date-controls">
                    <button className="nav-btn-glass" onClick={() => setSelectedDate(prev => subDays(prev, 1))}>
                        <ChevronLeft size={20} />
                    </button>
                    <span className="current-date-label">{isToday ? 'Today' : format(selectedDate, 'MMM d')}</span>
                    <button className="nav-btn-glass" onClick={() => setSelectedDate(prev => addDays(prev, 1))}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {activeTab === 'habits' ? (
                <div className="habits-grid">
                    {sortedHabits.length === 0 ? (
                        <div className="empty-glass-state">
                            <p>No habits set for this day.</p>
                            <button className="create-btn-glass" onClick={() => setIsEditModalOpen(true)}>
                                Start a New Journey
                            </button>
                        </div>
                    ) : (
                        sortedHabits.map((habit, index) => {
                            const isCompleted = logs.some(l => l.habitId === habit.id && l.date === dateStr && l.completed);
                            return (
                                <div key={habit.id} className="habit-grid-item" style={{ animationDelay: `${index * 100}ms` }}>
                                    <HabitCard
                                        habit={habit}
                                        completed={isCompleted}
                                        onToggle={() => toggleHabitCompletion(habit.id, dateStr)}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="todos-section">
                    <TodoList />
                </div>
            )}

            <Modal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                title="Edit Habit"
            >
                <HabitForm onClose={closeEditModal} habitToEdit={editingHabit} />
            </Modal>
        </div>
    );
};
