import express from 'express';
import User from '../models/User.js';
import Habit from '../models/Habit.js';
import Todo from '../models/Todo.js';
import HabitLog from '../models/HabitLog.js';
import SystemSetting from '../models/SystemSetting.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// @route   GET api/admin/users
// @desc    Get all users with stats
// @access  Private/Admin
router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/admin/users/:id
// @desc    Get user details (habits, todos)
// @access  Private/Admin
router.get('/users/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const habits = await Habit.find({ user: req.params.id });
        const todos = await Todo.find({ user: req.params.id });

        res.json({ user, habits, todos });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/admin/users/:id
// @desc    Delete user and all related data
// @access  Private/Admin
router.delete('/users/:id', auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Remove everything related to the user
        await Habit.deleteMany({ user: req.params.id });
        await HabitLog.deleteMany({ user: req.params.id });
        await Todo.deleteMany({ user: req.params.id });
        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});


// @route   GET api/admin/settings
// @desc    Get all system settings
router.get('/settings', async (req, res) => {
    try {
        const settings = {
            allowRegistrations: await SystemSetting.get('allowRegistrations', true),
            maintenanceMode: await SystemSetting.get('maintenanceMode', false),
            emailNotifications: await SystemSetting.get('emailNotifications', true),
            publicLeaderboard: await SystemSetting.get('publicLeaderboard', true)
        };
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/admin/settings
// @desc    Update system settings
router.post('/settings', async (req, res) => {
    try {
        const { allowRegistrations, maintenanceMode, emailNotifications, publicLeaderboard } = req.body;

        await SystemSetting.set('allowRegistrations', allowRegistrations, req.user.id);
        await SystemSetting.set('maintenanceMode', maintenanceMode, req.user.id);
        await SystemSetting.set('emailNotifications', emailNotifications, req.user.id);
        await SystemSetting.set('publicLeaderboard', publicLeaderboard, req.user.id);

        res.json({ msg: 'Settings Updated', settings: req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

export default router;
