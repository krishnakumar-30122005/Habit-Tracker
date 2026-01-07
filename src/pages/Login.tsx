
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export const Login: React.FC = () => {
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

            login(data.token);

            // Check role and redirect
            try {
                const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
                if (tokenPayload.user.role === 'admin') {
                    navigate('/admin', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (e) {
                navigate('/', { replace: true });
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Continue your habit journey</p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="auth-btn">
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
                <p className="auth-footer" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                    <Link to="/admin/login" className="text-gray-500 hover:text-purple-400">Admin Access</Link>
                </p>
            </div>
        </div>
    );
};
