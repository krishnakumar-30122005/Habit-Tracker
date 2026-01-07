import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <div className="admin-logo-icon">
                        <Shield size={18} color="#fff" />
                    </div>
                    <span>Nexus Admin</span>
                </div>

                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>User Management</span>
                    </NavLink>
                    <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>System Settings</span>
                    </NavLink>
                </nav>

                <div className="admin-footer">
                    <button onClick={handleLogout} className="admin-nav-item" style={{ width: '100%', cursor: 'pointer', border: 'none', background: 'transparent' }}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                <div className="admin-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
