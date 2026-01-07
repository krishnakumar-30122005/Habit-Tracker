import express from 'express';
import { auth } from '../middleware/auth.js';
import FocusSession from '../models/FocusSession.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// @route   POST api/focus/start
// @desc    Start a new focus session
// @access  Private
router.post('/start', auth, async (req, res) => {
    try {
        const { durationMinutes, category } = req.body;

        // Close any existing active sessions first
        await FocusSession.updateMany(
            { user: req.user.id, status: 'active' },
            { status: 'cancelled', endTime: Date.now() }
        );

        const newSession = new FocusSession({
            user: req.user.id,
            durationMinutes,
            category
        });

        await newSession.save();
        res.json(newSession);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/focus/complete
// @desc    Complete current session and award XP
// @access  Private
router.post('/complete', auth, async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await FocusSession.findById(sessionId);

        if (!session) return res.status(404).json({ msg: 'Session not found' });
        if (session.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        session.status = 'completed';
        session.endTime = Date.now();
        await session.save();

        // Award XP (10 XP per minute focused, capped at 500)
        // Bonus: "Deep Work"
        const xpEarned = Math.min(session.durationMinutes * 2, 500);

        const user = await User.findById(req.user.id);
        let levelUp = false;
        if (user) {
            user.xp += xpEarned;
            const newLevel = Math.floor(user.xp / 100) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
                levelUp = true;

                // Log Level Up
                await Activity.create({
                    user: req.user.id,
                    userName: user.name || 'Anonymous',
                    type: 'LEVEL_UP',
                    message: `reached Level ${newLevel} after a study session!`,
                    targetId: null
                });
            }
            await user.save();
        }

        res.json({ msg: 'Session Completed', xpEarned, levelUp, userStats: { xp: user?.xp, level: user?.level } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/focus/active
// @desc    Get count and list of active users
// @access  Private
router.get('/active', auth, async (req, res) => {
    try {
        // Find sessions started in last 4 hours that are still active
        // (Safety timeout)
        const activeSessions = await FocusSession.find({
            status: 'active',
        })
            .populate('user', 'name')
            .sort({ startTime: -1 })
            .limit(10); // Show last 10 people

        const count = await FocusSession.countDocuments({ status: 'active' });

        res.json({ activeUsers: activeSessions, totalActive: count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;
