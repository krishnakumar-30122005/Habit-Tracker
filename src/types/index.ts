
export type HabitFrequency = 'daily' | 'weekly';
export type HabitTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type HabitCategory = 'health' | 'learning' | 'productivity' | 'mindset' | 'lifestyle' | 'custom';
export type HabitType = 'boolean' | 'measurable';

export interface Habit {
    id: string;
    title: string;
    description?: string;
    category: HabitCategory;
    frequency: HabitFrequency; // default 'daily'
    timeOfDay: HabitTimeOfDay;
    targetCount: number; // For measurable habits (e.g. 5 glasses of water), 1 for boolean
    createdDt: string; // ISO Date
    archived: boolean;
    streak: number;
    bestStreak: number;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string; // YYYY-MM-DD
    count: number; // Current progress for the day
    completed: boolean;
    notes?: string;
    mood?: number; // 1-5
}

export interface AppSettings {
    userName: string;
    theme: 'dark' | 'light';
}
