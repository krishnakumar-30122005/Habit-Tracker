import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.js';
import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';


// Fallback function when AI API fails
function generateLocalInsights(habits, logs, totalCompletions) {
    const strengths = [];
    const improvements = [];
    const goals = [];

    habits.forEach(h => {
        const hLogs = logs.filter(l => l.habitId.toString() === h.id);
        const completionRate = hLogs.length / 30; // approx for last 30 days

        if (h.streak > 3) {
            strengths.push(`Strong consistency with '${h.title}' (${h.streak} day streak!)`);
        } else if (hLogs.length > 5) {
            strengths.push(`Good tracking of '${h.title}'`);
        } else {
            improvements.push(`Try to focus more on '${h.title}'`);
        }
    });

    if (strengths.length === 0) strengths.push("You're just getting started!");
    if (improvements.length === 0) improvements.push("You're doing fantastic!");

    goals.push("Complete all habits tomorrow");
    goals.push("Extend your longest streak by 1 day");

    return {
        strengths: strengths.slice(0, 3),
        patterns: ["Consistency builds over time", "Focus on one day at a time"],
        improvements: improvements.slice(0, 3),
        goals: goals,
        message: "I'm having trouble connecting to my AI brain right now, but here is a simple report based on your data. Keep going!"
    };
}

// @route   POST api/ai/coach
// @desc    Analyze habits and provide coaching
// @access  Private
router.post('/coach', auth, async (req, res) => {
    try {
        // 1. Gather User Data
        const habits = await Habit.find({ userId: req.user.id });
        const logs = await HabitLog.find({ userId: req.user.id });

        if (habits.length === 0) {
            return res.status(400).json({ msg: 'No habits found to analyze' });
        }

        const totalCompletions = logs.filter(l => l.completed).length;

        // Try AI if Key exists
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (apiKey && apiKey !== 'PASTE_YOUR_HF_TOKEN_HERE') {
            try {
                // Format data for AI
                const habitSummary = habits.map(h => {
                    const completedCount = logs.filter(l => l.habitId.toString() === h.id).length;
                    return `- ${h.title}: Streak ${h.streak}, Total Completed ${completedCount}, Time: ${h.timeOfDay}`;
                }).join('\n');

                const systemPrompt = `You are an AI Habit Coach. Output ONLY valid JSON.
Analyze this user data:
Total Completions: ${totalCompletions}
Habits:
${habitSummary}

Structure your response exactly like this JSON:
{
  "strengths": ["point 1", "point 2"],
  "patterns": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "goals": ["goal 1", "goal 2"],
  "message": "Short motivational message"
}`;

                // 2. Call HuggingFace Router API (OpenAI Compatible)
                const response = await fetch(
                    "https://router.huggingface.co/v1/chat/completions",
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "Content-Type": "application/json",
                        },
                        method: "POST",
                        body: JSON.stringify({
                            model: "Qwen/Qwen2.5-7B-Instruct",
                            messages: [
                                { role: "system", content: systemPrompt },
                                { role: "user", content: "Analyze my habits." }
                            ],
                            max_tokens: 1000,
                            temperature: 0.7
                        }),
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`HF API Error: ${response.status} ${response.statusText}`);

                    if (response.status === 410 || response.status === 403) {
                        throw new Error('HuggingFace Account Pending Verification (or Model Gated). Please check email.');
                    }

                    throw new Error(`HuggingFace API Error: ${response.statusText}`);
                }

                const result = await response.json();
                console.log('HF API Success. Result:', JSON.stringify(result).substring(0, 200) + '...');

                let text = result.choices[0].message.content; // OpenAI format

                // Clean up markdown code blocks if present to ensure valid JSON
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                // Extract JSON substring if there's extra text
                const jsonStart = text.indexOf('{');
                const jsonEnd = text.lastIndexOf('}') + 1;
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    text = text.substring(jsonStart, jsonEnd);
                }

                const analysis = JSON.parse(text);
                return res.json(analysis);

            } catch (aiError) {
                console.error("AI Generation Failed, switching to local:", aiError.message);
                // Fall through to local logic
            }
        }

        // 2. Fallback: Local Logic
        console.log("Using Local Logic Fallback");
        const localAnalysis = generateLocalInsights(habits, logs, totalCompletions);
        res.json(localAnalysis);

    } catch (err) {
        console.error('Coach Error:', err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;
