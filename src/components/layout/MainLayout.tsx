import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart2, Settings, PlusCircle, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { HabitForm } from '../../features/habits/HabitForm';
import NotificationManager from '../../features/notifications/NotificationManager';
import LevelBadge from '../gamification/LevelBadge';
import { Trophy } from 'lucide-react';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="layout-container">
            <NotificationManager />
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon">H</div>
                    <span className="logo-text">HabitFlow</span>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Daily</span>
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} />
                        <span>Calendar</span>
                    </NavLink>
                    <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <BarChart2 size={20} />
                        <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/coach" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Sparkles size={20} />
                        <span>AI Coach</span>
                    </NavLink>
                    <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Trophy size={20} />
                        <span>Leaderboard</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={logout} className="nav-item logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div className="top-bar-left">
                        <h1 className="page-title">Today's Focus</h1>
                    </div>

                    <div className="top-actions">
                        <LevelBadge />
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                            <PlusCircle size={18} />
                            <span>New Habit</span>
                        </button>
                    </div>
                </header>
                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>

            <nav className="mobile-bottom-nav">
                <NavLink to="/" end className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={24} />
                    <span className="mobile-nav-label">Daily</span>
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={24} />
                    <span className="mobile-nav-label">Calendar</span>
                </NavLink>
                <div className="mobile-fab-container">
                    <button className="mobile-fab" onClick={() => setIsModalOpen(true)}>
                        <PlusCircle size={28} />
                    </button>
                </div>
                <NavLink to="/analytics" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart2 size={24} />
                    <span className="mobile-nav-label">Analytics</span>
                </NavLink>
                <NavLink to="/coach" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Sparkles size={24} />
                    <span className="mobile-nav-label">Coach</span>
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={24} />
                    <span className="mobile-nav-label">Settings</span>
                </NavLink>
                <NavLink to="/leaderboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
                    <Trophy size={24} />
                    <span className="mobile-nav-label">Ranks</span>
                </NavLink>
            </nav>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Habit"
            >
                <HabitForm onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default MainLayout;
