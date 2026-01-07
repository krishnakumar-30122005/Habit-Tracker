import React, { useState, useEffect } from 'react';
import { Save, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminSettings.css'; // Import explicit layout styles

export const AdminSettings: React.FC = () => {
    const { token } = useAuth();
    const [settings, setSettings] = useState({
        allowRegistrations: true,
        maintenanceMode: false,
        emailNotifications: true,
        publicLeaderboard: true
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                headers: { 'x-auth-token': token! }
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                alert('Settings saved successfully!');
            }
        } catch (err) {
            alert('Failed to save settings');
        }
    };

    return (
        <div className="admin-settings-container">
            {/* Header */}
            <header className="settings-header">
                <h1>System Settings</h1>
                <p>Configure platform-wide preferences</p>
            </header>

            {/* Settings Panels Grid */}
            <div className="settings-grid">
                {/* Security Settings */}
                <div className="settings-panel">
                    <div className="panel-header">
                        <Shield size={20} style={{ color: '#818cf8' }} /> {/* Indigo-400 */}
                        <h3>Security & Access</h3>
                    </div>
                    <div className="panel-content">
                        {/* Toggle Row 1 */}
                        <div className="setting-row">
                            <div className="setting-info">
                                <h4>Allow New Registrations</h4>
                                <p>Users can sign up for new accounts</p>
                            </div>
                            <button
                                onClick={() => handleChange('allowRegistrations')}
                                className={`toggle-switch ${settings.allowRegistrations ? 'toggle-on' : 'toggle-off'}`}
                                aria-label="Toggle registrations"
                            />
                        </div>

                        {/* Toggle Row 2 */}
                        <div className="setting-row">
                            <div className="setting-info">
                                <h4>Maintenance Mode</h4>
                                <p>Disable access for non-admin users</p>
                            </div>
                            <button
                                onClick={() => handleChange('maintenanceMode')}
                                className={`toggle-switch ${settings.maintenanceMode ? 'toggle-on' : 'toggle-off'}`}
                                style={{ backgroundColor: settings.maintenanceMode ? '#ef4444' : undefined }} // Red for warning
                                aria-label="Toggle maintenance mode"
                            />
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="settings-panel">
                    <div className="panel-header">
                        <Globe size={20} style={{ color: '#22d3ee' }} /> {/* Cyan-400 */}
                        <h3>General Preferences</h3>
                    </div>
                    <div className="panel-content">
                        {/* Toggle Row 3 */}
                        <div className="setting-row">
                            <div className="setting-info">
                                <h4>Public Leaderboard</h4>
                                <p>Visible to all registered users</p>
                            </div>
                            <button
                                onClick={() => handleChange('publicLeaderboard')}
                                className={`toggle-switch ${settings.publicLeaderboard ? 'toggle-on' : 'toggle-off'}`}
                                style={{ backgroundColor: settings.publicLeaderboard ? '#3b82f6' : undefined }} // Blue
                                aria-label="Toggle leaderboard"
                            />
                        </div>

                        {/* Toggle Row 4 */}
                        <div className="setting-row">
                            <div className="setting-info">
                                <h4>System Email Notifications</h4>
                                <p>Send alerts for critical events</p>
                            </div>
                            <button
                                onClick={() => handleChange('emailNotifications')}
                                className={`toggle-switch ${settings.emailNotifications ? 'toggle-on' : 'toggle-off'}`}
                                style={{ backgroundColor: settings.emailNotifications ? '#a855f7' : undefined }} // Purple
                                aria-label="Toggle notifications"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="settings-footer">
                <button
                    onClick={handleSave}
                    className="save-btn"
                >
                    <Save size={18} />
                    Save Changes
                </button>
            </div>
        </div>
    );
};
