import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, BarChart2, Settings, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { HabitForm } from '../../features/habits/HabitForm';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    const { logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="layout-container">
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
                    <h1 className="page-title">Today's Focus</h1>
                    <div className="top-actions">
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
