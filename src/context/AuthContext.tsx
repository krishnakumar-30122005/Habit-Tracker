
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    role: 'user' | 'admin';
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    updateUserStats: (stats: { xp?: number; level?: number }, isLevelUp?: boolean) => void;
    showLevelUp: boolean;
    closeLevelUp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await fetch('/api/auth/user', {
                        headers: {
                            'x-auth-token': token
                        }
                    });
                    if (res.ok) {
                        const userData = await res.json();
                        setUser(userData);
                    } else {
                        localStorage.removeItem('token');
                        setToken(null);
                        setUser(null);
                    }
                } catch (err) {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUserStats = (stats: { xp?: number; level?: number }, isLevelUp: boolean = false) => {
        if (user) {
            setUser({ ...user, ...stats });
            if (isLevelUp) {
                setShowLevelUp(true);
            }
        }
    };

    const closeLevelUp = () => setShowLevelUp(false);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            loading,
            login,
            logout,
            updateUserStats,
            showLevelUp,
            closeLevelUp
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
