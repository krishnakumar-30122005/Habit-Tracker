
import React from 'react';
import { useHabits } from '../context/HabitContext';
import { useTheme } from '../context/ThemeContext';
import { Download, Moon, Sun } from 'lucide-react';
import { format } from 'date-fns';
import './SettingsView.css';

export const SettingsView: React.FC = () => {
    const { habits, logs } = useHabits();
    const { theme, toggleTheme } = useTheme();

    const handleExport = () => {
        // 1. Prepare Data
        const data = {
            habits,
            logs,
            exportDate: new Date().toISOString()
        };

        // 2. Create Blob
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // 3. Trigger Download
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-flow-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleCSVExport = () => {
        // Simple CSV of logs
        const headers = ['Date', 'Habit Title', 'Category', 'Completed'];
        const csvRows = [headers.join(',')];

        logs.forEach(log => {
            const habit = habits.find(h => h.id === log.habitId);
            if (habit) {
                csvRows.push([
                    log.date,
                    `"${habit.title}"`,
                    habit.category,
                    log.completed ? 'Yes' : 'No'
                ].join(','));
            }
        });

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `habit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="settings-view">
            <h2 className="settings-title">Settings</h2>

            <div className="settings-section">
                <h3>Data Management</h3>
                <p className="settings-desc">Export your data to backup or analyze externally.</p>

                <div className="settings-actions">
                    <button className="btn-secondary" onClick={handleExport}>
                        <Download size={18} />
                        <span>Backup JSON</span>
                    </button>
                    <button className="btn-secondary" onClick={handleCSVExport}>
                        <Download size={18} />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>



            <div className="settings-section">
                <h3>Notifications</h3>
                <p className="settings-desc">Get reminders at 9 AM, 2 PM, and 8 PM if you have unfinished habits.</p>
                <div className="settings-actions">
                    <button
                        className="btn-secondary"
                        onClick={() => Notification.requestPermission().then(p => {
                            if (p === 'granted') new Notification('Reminders Enabled! 🔔');
                        })}
                    >
                        <span>🔔 Enable Reminders</span>
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h3>Appearance</h3>
                <p className="settings-desc">Toggle between dark and light mode (System default currently active).</p>
                <div className="settings-actions">
                    <button className="btn-secondary" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </div>

            <div className="settings-info">
                <p>HabitFlow v1.0.0</p>
                <p>Local Storage Used: {JSON.stringify(localStorage).length} bytes</p>
            </div>
        </div >
    );
};
