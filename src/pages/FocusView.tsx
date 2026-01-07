import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './FocusView.css';

const FocusView: React.FC = () => {
    const { token } = useAuth();
    const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // 25 mins
    const [isActive, setIsActive] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [activePeers, setActivePeers] = useState(0);

    // Initial Active Count Fetch
    useEffect(() => {
        const fetchPeers = async () => {
            if (!token) return;
            const res = await fetch('/api/focus/active', { headers: { 'x-auth-token': token } });
            if (res.ok) {
                const data = await res.json();
                setActivePeers(data.totalActive);
            }
        };
        fetchPeers();
        const interval = setInterval(fetchPeers, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [token]);

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isActive) {
            handleComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleStart = async () => {
        if (!token) return;
        setIsActive(true);
        try {
            const res = await fetch('/api/focus/start', {
                method: 'POST',
                headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ durationMinutes: 25, category: 'study' })
            });
            if (res.ok) {
                const data = await res.json();
                setSessionId(data._id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleComplete = async () => {
        setIsActive(false);
        if (!token || !sessionId) return;
        try {
            await fetch('/api/focus/complete', {
                method: 'POST',
                headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
            });
            alert("Session Complete! +50 XP");
            setTimeLeft(25 * 60); // Reset
        } catch (err) {
            console.error(err);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="focus-view-container">
            <div className="focus-header">
                <h1>Focus Room</h1>
                <p>Deep work session. Minimize distractions.</p>
            </div>

            <div className="focus-center-stage">
                <div className="timer-circle">
                    <div className="time-display">{formatTime(timeLeft)}</div>
                    <div className="timer-status">{isActive ? 'Focusing...' : 'Ready?'}</div>
                </div>

                <div className="peers-online">
                    <div className="pulse-dot"></div>
                    <span>{isActive ? activePeers + 1 : activePeers} Students focusing</span>
                </div>

                <div className="timer-controls">
                    {!isActive ? (
                        <button className="start-focus-btn" onClick={handleStart}>
                            <Play size={24} fill="currentColor" /> Start 25m Session
                        </button>
                    ) : (
                        <button className="stop-focus-btn" onClick={() => setIsActive(false)}>
                            <Pause size={24} fill="currentColor" /> Pause
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FocusView;
