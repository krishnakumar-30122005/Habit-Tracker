
import type { HabitLog } from '../types';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

export const calculateStreak = (habitId: string, logs: HabitLog[]): number => {
    const habitLogs = logs
        .filter(l => l.habitId === habitId && l.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (habitLogs.length === 0) return 0;

    const today = new Date();
    const yesterday = subDays(today, 1);

    // Check if the most recent log is today or yesterday
    const lastLogDate = parseISO(habitLogs[0].date);

    // If no log today or yesterday, streak is broken (0), UNLESS we want to show the 'current inactive streak' which is usually 0.
    // However, some apps show the streak "frozen" until you miss the day. 
    // Logic: If last log was yesterday or today, the streak is alive.
    // If last log was before yesterday, streak is broken.

    // Wait, simple iteration:
    // 1. Check if we have a log for today. If yes, start counting from today.
    // 2. If no log for today, check yesterday. If yes, start counting from yesterday.
    // 3. If neither, streak is 0.

    let currentStreak = 0;
    let checkDate = isSameDay(lastLogDate, today) ? today : (isSameDay(lastLogDate, yesterday) ? yesterday : null);

    if (!checkDate) return 0;

    // We found a starting point (today or yesterday). Now count backwards.
    // We iterate days backwards and check if a log exists.

    // Optimization: Since habitLogs is sorted desc, we can just iterate the array?
    // Not necessarily, because there might be multiple logs per day (though we should enforce unique),
    // or gaps. Better to iterate DATES backwards.

    // Let's use the array for efficiency but be careful about gaps.

    // Robust approach:
    // walk backwards from 'checkDate' day by day.

    let pointerDate = checkDate;

    while (true) {
        const dateStr = format(pointerDate, 'yyyy-MM-dd');
        const hasLog = habitLogs.some(l => l.date === dateStr); // Inefficient for large logs, but fine for local

        if (hasLog) {
            currentStreak++;
            pointerDate = subDays(pointerDate, 1);
        } else {
            break;
        }
    }

    return currentStreak;
};
