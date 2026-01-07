import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';
import './Auth.css';

export const AdminLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Login failed');
            }

            // Decode token payload to check role client-side before redirecting
            // Note: Ideally, specific admin-login endpoint would handle this, but for now we check the decoded token or user response
            // Since our login returns { token }, we rely on the backend validation or we check the user profile immediately.

            // For now, we'll log them in, then check. Ideally, the token contains the role.
            // Let's decode the token briefly or use a specific admin check.
            const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));

            if (tokenPayload.user.role !== 'admin') {
                throw new Error('Access restricted: Administrators only');
            }

            login(data.token);
            navigate('/admin', { replace: true });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container admin-theme">
            <div className="auth-card glass-panel border-purple-500/30">
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center border border-purple-500/50">
                        <Shield className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
                <h2 className="auth-title">Admin Portal</h2>
                <p className="auth-subtitle">Restricted Access</p>

                {error && <div className="auth-error border-red-500/50 bg-red-500/10 text-red-400">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="flex items-center gap-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                            className="focus:border-purple-500"
                        />
                    </div>

                    <div className="form-group">
                        <label className="flex items-center gap-2">
                            <Lock size={14} /> Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="focus:border-purple-500"
                        />
                    </div>

                    <button type="submit" className="auth-btn bg-purple-600 hover:bg-purple-700">
                        Access Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};
