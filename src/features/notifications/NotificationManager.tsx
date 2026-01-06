import React, { useEffect } from 'react';
import { useHabits } from '../../context/HabitContext';

const NotificationManager: React.FC = () => {
    const { habits, logs } = useHabits();

    useEffect(() => {
        // Request permission on mount (non-blocking)
        if ('Notification' in window && Notification.permission === 'default') {
            // We can ask passively, or wait for user interaction to be polite.
            // For now, let's just log availability.
            console.log('Notifications available');
        }

        const checkReminders = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();
            const currentHour = now.getHours();

            // Logic: Check at 9 AM, 2 PM, 8 PM
            const checkTimes = [9, 14, 20];
            if (!checkTimes.includes(currentHour)) return;

            // Only notify if we haven't already notified this hour (simple debounce via local storage)
            const lastNotify = localStorage.getItem('last_notification_hour');
            const storedDate = localStorage.getItem('last_notification_date');
            const todayStr = now.toDateString();

            if (storedDate === todayStr && lastNotify === currentHour.toString()) {
                return;
            }

            // Find incomplete habits for today
            const todayLogStr = now.toISOString().split('T')[0];
            const incompleteCount = habits.filter(h =>
                !h.archived &&
                !logs.some(l => l.habitId === h.id && l.date === todayLogStr && l.completed)
            ).length;

            if (incompleteCount > 0) {
                new Notification('HabitFlow Reminder 🔔', {
                    body: `You have ${incompleteCount} habits left for today. Keep your streak alive!`,
                    icon: '/vite.svg' // Fallback icon
                });

                // Update storage
                localStorage.setItem('last_notification_hour', currentHour.toString());
                localStorage.setItem('last_notification_date', todayStr);
            }
        };

        // Check every minute
        const intervalId = setInterval(checkReminders, 60000);

        // Initial check
        checkReminders();

        return () => clearInterval(intervalId);
    }, [habits, logs]);

    return null; // Invisible component
};

export default NotificationManager;
