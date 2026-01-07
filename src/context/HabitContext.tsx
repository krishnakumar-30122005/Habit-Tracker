
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Habit, HabitLog } from '../types';
import { calculateStreak } from '../utils/streakUtils';
import { useAuth } from './AuthContext';
import { format } from 'date-fns';

interface HabitContextType {
    habits: Habit[];
    logs: HabitLog[];
    addHabit: (habit: Omit<Habit, 'id' | 'createdDt' | 'streak' | 'bestStreak' | 'archived'>) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    deleteHabit: (id: string) => void;
    toggleHabitCompletion: (habitId: string, date: string) => void;
    getHabitLogs: (habitId: string) => HabitLog[];
    getHabitToday: (habitId: string) => boolean;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isAuthenticated, updateUserStats } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchHabits();
        } else {
            setHabits([]);
            setLogs([]);
        }
    }, [isAuthenticated, token]);

    const fetchHabits = async () => {
        try {
            const res = await fetch('/api/habits', {
                headers: { 'x-auth-token': token! }
            });
            const data = await res.json();
            // Backend sends { habits, logs }
            // Mongoose objects contain _id, we need to map to id or handle it.
            // My types expect 'id'. Let's map _id to id.
            if (data.habits && Array.isArray(data.habits)) {
                const mappedHabits = data.habits.map((h: any) => ({ ...h, id: h._id }));
                setHabits(mappedHabits);
            }

            if (data.logs && Array.isArray(data.logs)) {
                const mappedLogs = data.logs.map((l: any) => ({ ...l, id: l._id }));
                setLogs(mappedLogs);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addHabit = async (habitData: Omit<Habit, 'id' | 'createdDt' | 'streak' | 'bestStreak' | 'archived'>) => {
        try {
            const res = await fetch('/api/habits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify(habitData)
            });
            const newHabit = await res.json();
            setHabits(prev => [...prev, { ...newHabit, id: newHabit._id }]);
        } catch (err) {
            console.error(err);
        }
    };

    const updateHabit = async (id: string, updates: Partial<Habit>) => {
        try {
            const res = await fetch(`/api/habits/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify(updates)
            });
            const updatedHabit = await res.json();
            setHabits(prev => prev.map(h => h.id === id ? { ...updatedHabit, id: updatedHabit._id } : h));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteHabit = async (id: string) => {
        try {
            await fetch(`/api/habits/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token! }
            });
            setHabits(prev => prev.filter(h => h.id !== id));
            setLogs(prev => prev.filter(l => l.habitId !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const toggleHabitCompletion = async (habitId: string, date: string) => {
        try {
            const res = await fetch(`/api/habits/${habitId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify({ date })
            });
            const data = await res.json();

            // Update user Gamification Stats
            if (data.userStats) {
                updateUserStats(data.userStats, data.levelUp);
            }

            if (data.state === 'completed') {
                // Toggled on
                setLogs(prev => [...prev, {
                    id: 'temp-' + Date.now(), // ID not returned by toggle API immediately unless we change API. 
                    // But for streak calc, we just need presence.
                    // Ideally API should return the full log object.
                    habitId,
                    date,
                    completed: true,
                    count: 1,
                    userId: 'me' // fallback
                }]);
            } else {
                // Toggled off
                setLogs(prev => prev.filter(l => !(l.habitId === habitId && l.date === date)));
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Streaks are calculated on frontend based on logs.
    // However, backend *could* calculate them. But Habit schema has 'streak'.
    // My previous frontend logic calculated streaks and updated "habits" state.
    // With API, we should update the valid habit state.
    // Let's rely on frontend streak calculation for UI responsiveness for now, 
    // or trust backend if backend updates it. 
    // Backend API didn't implement streak calculation logic on toggle.
    // So let's re-run streak calculation on frontend and OPTIONALLY update backend?
    // Actually, just calculating it for display is enough.
    // Habit.streak property might be stale if backend doesn't update it. 
    // Let's compute streaks dynamically for display?
    // Or just re-use the useEffect logic I had before, but only set local state.

    useEffect(() => {
        if (habits.length === 0) return;

        let hasUpdates = false;
        const updatedHabits = habits.map(habit => {
            const currentStreak = calculateStreak(habit.id, logs);
            if (currentStreak !== habit.streak) {
                hasUpdates = true;
                return { ...habit, streak: currentStreak, bestStreak: Math.max(habit.bestStreak, currentStreak) };
            }
            return habit;
        });

        if (hasUpdates) {
            setHabits(updatedHabits);
            // Note: We are NOT saving this streak back to DB here to avoid spamming API.
            // Visual only. 
        }
    }, [logs]);

    const getHabitLogs = (habitId: string) => {
        return logs.filter((l) => l.habitId === habitId);
    };

    const getHabitToday = (habitId: string) => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return logs.some((l) => l.habitId === habitId && l.date === today && l.completed);
    };

    return (
        <HabitContext.Provider
            value={{
                habits,
                logs,
                addHabit,
                updateHabit,
                deleteHabit,
                toggleHabitCompletion,
                getHabitLogs,
                getHabitToday,
            }}
        >
            {children}
        </HabitContext.Provider>
    );
};

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};
