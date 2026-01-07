import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, Target, Search, CheckCircle, ArrowRight } from 'lucide-react';
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
        <div className="coach-view-container">
            {/* Hero Header */}
            <div className="coach-header">
                <div className="header-badge">
                    <Sparkles size={16} />
                    <span>AI-Powered Insights</span>
                </div>
                <h1>Your Personal Habit Coach</h1>
                <p>Unlock patterns in your behavior and get personalized growth strategies.</p>
            </div>

            {/* Empty State / Call to Action */}
            {!analysis && !loading && (
                <div className="coach-empty-state">
                    <div className="empty-content">
                        <div className="pulse-avatar">
                            <Sparkles size={48} />
                        </div>
                        <h2>Ready for your analysis?</h2>
                        <p>I'll scan your recent activity to find hidden trends and streaks.</p>
                        <button className="cta-button" onClick={generateAnalysis}>
                            Generate Report <ArrowRight size={18} />
                        </button>
                    </div>
                    {error && <div className="error-banner">{error}</div>}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="coach-loading-state">
                    <div className="spinner-ring"></div>
                    <h3>Analyzing your data...</h3>
                    <p>Connecting dots between your habits and goals</p>
                </div>
            )}

            {/* Analysis Results Grid */}
            {analysis && (
                <div className="analysis-grid fade-in">

                    {/* Top Message Card - span full width */}
                    <div className="grid-item full-width message-card">
                        <div className="coach-avatar-small">
                            <Sparkles size={24} />
                        </div>
                        <div className="message-content">
                            <h3>Coach's Note</h3>
                            <p>"{analysis.message}"</p>
                        </div>
                    </div>

                    {/* Strengths Card */}
                    <div className="grid-item card-green">
                        <div className="card-header">
                            <CheckCircle size={24} className="icon-green" />
                            <h3>What You're Crushing</h3>
                        </div>
                        <ul className="list-styled">
                            {analysis.strengths.map((feat, i) => (
                                <li key={i}>{feat}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Patterns Card */}
                    <div className="grid-item card-blue">
                        <div className="card-header">
                            <Search size={24} className="icon-blue" />
                            <h3>Observed Patterns</h3>
                        </div>
                        <ul className="list-styled">
                            {analysis.patterns.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Improvements Card */}
                    <div className="grid-item card-amber">
                        <div className="card-header">
                            <TrendingUp size={24} className="icon-amber" />
                            <h3>Areas to Improve</h3>
                        </div>
                        <ul className="list-styled">
                            {analysis.improvements.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Goals Card - span full width on mobile, maybe side on desktop */}
                    <div className="grid-item full-width goals-card">
                        <div className="card-header">
                            <Target size={24} className="icon-purple" />
                            <h3>Recommended Goals for This Week</h3>
                        </div>
                        <div className="goals-grid-inner">
                            {analysis.goals.map((goal, i) => (
                                <div key={i} className="goal-pill">
                                    <span className="goal-check"></span>
                                    {goal}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating Action to Re-analyze */}
                    <div className="reanalyze-container">
                        <button className="secondary-btn" onClick={generateAnalysis}>
                            Run New Analysis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
