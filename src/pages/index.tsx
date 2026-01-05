import React from 'react';
import { MonthlyView } from './MonthlyView';

export * from './Login';
export * from './Signup';
export * from './DailyView';
export * from './WeeklyView';
export { MonthlyView }; // Keep this as is, as MonthlyView is imported and then re-exported specifically.
export * from './AnalyticsView';

export const CalendarView: React.FC = () => {
    // Alias to MonthlyView
    return <MonthlyView />;
};

export { SettingsView } from './SettingsView';
