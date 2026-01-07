import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Search, ShieldAlert, Shield } from 'lucide-react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import './AdminUsers.css'; // Importing specific styles to force layout

interface UserData {
    _id: string;
    name: string;
    email: string;
    level: number;
    xp: number;
    role: string;
}

export const AdminUsers: React.FC = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]); // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users', {
                headers: {
                    'x-auth-token': token || ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (err) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to permanently delete user "${name}"? This action cannot be reversed.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token || ''
                }
            });

            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            } else {
                alert('Failed to delete user');
            }
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>;

    return (
        <div className="admin-users-container">
            {/* Header Section */}
            <header className="admin-users-header">
                <div className="header-title-group">
                    <h1>Users</h1>
                    <p>Manage community access and details</p>
                </div>

                <div className="search-container">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg flex items-center gap-3">
                    <ShieldAlert size={20} />
                    {error}
                </div>
            )}

            {/* Content Table Card */}
            <div className="users-table-card">
                <div className="card-header">
                    <h2>Registered Accounts</h2>
                    <span className="badge-pill" style={{ backgroundColor: '#374151', color: 'white' }}>
                        {filteredUsers.length} Users
                    </span>
                </div>

                <table className="custom-table">
                    <thead>
                        <tr>
                            <th className="col-user">User Details</th>
                            <th className="col-role">Role</th>
                            <th className="col-status text-center">Active</th>
                            <th className="col-stats text-right">Level & XP</th>
                            <th className="col-actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>
                                    <div className="user-info-flex">
                                        <div className="user-avatar">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-text">
                                            <h4>{user.name}</h4>
                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {user.role === 'admin' ? (
                                        <span className="badge-pill badge-admin">
                                            <Shield size={12} /> Admin
                                        </span>
                                    ) : (
                                        <span className="badge-pill badge-user">
                                            User
                                        </span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', margin: '0 auto', boxShadow: '0 0 5px #10b981' }}></div>
                                </td>
                                <td className="text-right">
                                    <div className="user-text">
                                        <h4 style={{ fontSize: '1.1rem' }}>{user.level}</h4>
                                        <span style={{ color: '#818cf8', fontFamily: 'monospace' }}>{user.xp.toLocaleString()} XP</span>
                                    </div>
                                </td>
                                <td className="text-right">
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => deleteUser(user._id, user.name)}
                                            className="action-btn"
                                            title="Delete Account"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
