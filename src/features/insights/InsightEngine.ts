
import type { Habit, HabitLog } from '../../types';
import { format, getDay, subDays } from 'date-fns';

export interface Insight {
    id: string;
    type: 'positive' | 'negative' | 'neutral' | 'suggestion';
    text: string;
    relevance: number; // 0-100
}

export const generateInsights = (habits: Habit[], logs: HabitLog[]): Insight[] => {
    const insights: Insight[] = [];
    const activeHabits = habits.filter(h => !h.archived);

    if (activeHabits.length === 0) return [{
        id: 'start', type: 'suggestion', text: 'Start by creating your first habit!', relevance: 100
    }];

    // 1. Day of Week Analysis
    const weekDayCounts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    logs.filter(l => l.completed).forEach(log => {
        const day = getDay(new Date(log.date));
        weekDayCounts[day]++;
    });

    const bestDay = Object.entries(weekDayCounts).sort((a, b) => b[1] - a[1])[0];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (weekDayCounts[Number(bestDay[0])] > 5) {
        insights.push({
            id: 'best-day',
            type: 'positive',
            text: `You are most productive on ${days[Number(bestDay[0])]}s!`,
            relevance: 80
        });
    }

    // 2. Weekend vs Weekday
    const weekendCount = weekDayCounts[0] + weekDayCounts[6];
    const weekdayCount = Object.values(weekDayCounts).reduce((a, b) => a + b, 0) - weekendCount;

    if (weekendCount * 2.5 < weekdayCount) { // rough normalization
        insights.push({
            id: 'weekend-dip',
            type: 'negative',
            text: 'Your consistency drops significantly on weekends.',
            relevance: 70
        });
    }

    // 3. Streak Recovery
    // Detect if a habit was broken recently (e.g. yesterday)
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    activeHabits.forEach(h => {
        const hasLogYesterday = logs.some(l => l.habitId === h.id && l.date === yesterday && l.completed);
        if (!hasLogYesterday && h.streak > 3) {
            insights.push({
                id: `streak-loss-${h.id}`,
                type: 'suggestion',
                text: `You missed "${h.title}" yesterday. Don't let it slide today!`,
                relevance: 90
            });
        }
    });

    // 4. Overall Growth
    // Compare this month completions vs last month (simplified)

    return insights.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
};
