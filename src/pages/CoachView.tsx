import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, Target, Search, CheckCircle } from 'lucide-react';
import './CoachView.css';

interface AIAnalysis {
    strengths: string[];
    patterns: string[];
    improvements: string[];
    goals: string[];
    message: string;
}

export const CoachView: React.FC = () => {
    const { token } = useAuth();
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateAnalysis = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/ai/coach', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                }
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Failed to get insights');
            }

            setAnalysis(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="coach-view">
            <div className="coach-hero">
                <h1>AI Habit Coach</h1>
                <p>Your personal productivity assistant</p>
            </div>

            {!analysis && !loading && (
                <div className="coach-empty">
                    <div className="coach-avatar-large">
                        <Sparkles size={48} />
                    </div>
                    <h2>Ready to analyze your progress?</h2>
                    <p>I'll look at your habits, streaks, and logs to provide personalized feedback.</p>
                    <button className="analyze-btn" onClick={generateAnalysis}>
                        <Sparkles size={20} />
                        Analyze My Habits
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </div>
            )}

            {loading && (
                <div className="coach-loading">
                    <div className="loading-spinner"></div>
                    <p>Thinking... analyzing your patterns...</p>
                </div>
            )}

            {analysis && (
                <div className="analysis-feed">
                    <div className="report-card">
                        <div className="card-header highlight">
                            <CheckCircle size={24} />
                            <h3>What You Did Well</h3>
                        </div>
                        <ul>
                            {analysis.strengths.map((feat, i) => (
                                <li key={i}>{feat}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="report-card">
                        <div className="card-header">
                            <Search size={24} />
                            <h3>Habit Patterns Observed</h3>
                        </div>
                        <ul>
                            {analysis.patterns.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="report-card">
                        <div className="card-header">
                            <TrendingUp size={24} />
                            <h3>Where You Can Improve</h3>
                        </div>
                        <ul>
                            {analysis.improvements.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="report-card">
                        <div className="card-header">
                            <Target size={24} />
                            <h3>Suggested Goals</h3>
                        </div>
                        <ul className="goals-list">
                            {analysis.goals.map((goal, i) => (
                                <li key={i}>{goal}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="coach-message">
                        <div className="coach-avatar-small">
                            <Sparkles size={20} />
                        </div>
                        <p>"{analysis.message}"</p>
                    </div>

                    <button className="analyze-btn secondary" onClick={generateAnalysis}>
                        Analyze Again
                    </button>
                </div>
            )}
        </div>
    );
};
