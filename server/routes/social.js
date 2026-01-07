import express from 'express';
import { auth } from '../middleware/auth.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// @route   GET api/social/feed
// @desc    Get global activity feed
// @access  Private
router.get('/feed', auth, async (req, res) => {
    try {
        const feed = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(feed);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/social/challenges
// @desc    Get all active challenges
// @access  Private
router.get('/challenges', auth, async (req, res) => {
    try {
        console.log("➡️  GET /api/social/challenges HIT");
        let challenges = await Challenge.find().sort({ participants: -1 });
        console.log(`📊 Found ${challenges.length} challenges in DB`);

        // AUTO-SEED: If no challenges exist, create defaults
        if (challenges.length === 0) {
            console.log("🌱 Database empty. Seeding Student Challenges...");
            const defaults = [
                { title: 'LeetCode Streak', description: 'Solve 1 DSA problem daily', category: 'academic', durationDays: 100, icon: '/assets/3d/productivity.png' },
                { title: 'Deep Work: 4H', description: '4 Hours of focused study/work', category: 'productivity', durationDays: 30, icon: '/assets/3d/mindfulness.png' },
                { title: 'No All-Nighter', description: 'Sleep before 1 AM every night', category: 'health', durationDays: 21, icon: '/assets/3d/fitness.png' },
                { title: 'Campus Networking', description: 'Meet 1 new person every week', category: 'social', durationDays: 60, icon: '🤝' }
            ];
            await Challenge.insertMany(defaults);
            challenges = await Challenge.find().sort({ participants: -1 });
        }

        // Add "joined" flag for current user
        const mappedHelper = challenges.map(c => ({
            ...c.toObject(),
            hasJoined: c.participants.includes(req.user.id),
            participantCount: c.participants.length
        }));

        res.json(mappedHelper);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/social/challenges
// @desc    Create a new challenge (Dev/Admin helper)
// @access  Private
router.post('/challenges', auth, async (req, res) => {
    try {
        const { title, description, category, durationDays, icon } = req.body;
        const newChallenge = new Challenge({
            title, description, category, durationDays, icon,
            createdBy: req.user.id
        });
        await newChallenge.save();
        res.json(newChallenge);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/social/challenges/:id/join
// @desc    Join or leave a challenge
// @access  Private
router.post('/challenges/:id/join', auth, async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

        const index = challenge.participants.indexOf(req.user.id);
        if (index === -1) {
            // Join
            challenge.participants.push(req.user.id);
            await challenge.save();

            // Log Activity
            await Activity.create({
                user: req.user.id,
                userName: req.user.name || 'Anonymous', // Fallback
                type: 'CHALLENGE_JOIN',
                message: `joined the ${challenge.title}`,
                targetId: challenge._id
            });

            res.json({ msg: 'joined', id: challenge._id, count: challenge.participants.length });
        } else {
            // Leave
            challenge.participants.splice(index, 1);
            await challenge.save();
            res.json({ msg: 'left', id: challenge._id, count: challenge.participants.length });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;
