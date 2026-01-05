import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.js';
import Habit from '../models/Habit.js';
import HabitLog from '../models/HabitLog.js';

// @route   GET api/habits
// @desc    Get all users habits
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const habits = await Habit.find({ userId: req.user.id }).sort({ createdDt: -1 });
        const logs = await HabitLog.find({ userId: req.user.id });
        res.json({ habits, logs });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/habits
// @desc    Add new habit
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, category, timeOfDay, frequency, targetCount } = req.body;

    try {
        const newHabit = new Habit({
            title,
            description,
            category,
            timeOfDay,
            frequency,
            targetCount,
            userId: req.user.id
        });

        const habit = await newHabit.save();
        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/habits/:id
// @desc    Update habit
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, category, timeOfDay, frequency, targetCount } = req.body;

    // Build habit object
    const habitFields = {};
    if (title) habitFields.title = title;
    if (description) habitFields.description = description;
    if (category) habitFields.category = category;
    if (timeOfDay) habitFields.timeOfDay = timeOfDay;
    if (frequency) habitFields.frequency = frequency;
    if (targetCount) habitFields.targetCount = targetCount;

    try {
        let habit = await Habit.findById(req.params.id);

        if (!habit) return res.status(404).json({ msg: 'Habit not found' });

        // Make sure user owns habit
        if (habit.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        habit = await Habit.findByIdAndUpdate(
            req.params.id,
            { $set: habitFields },
            { new: true }
        );

        res.json(habit);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/habits/:id
// @desc    Delete habit
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let habit = await Habit.findById(req.params.id);

        if (!habit) return res.status(404).json({ msg: 'Habit not found' });

        // Make sure user owns habit
        if (habit.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Habit.findByIdAndDelete(req.params.id);
        // Also remove logs
        await HabitLog.deleteMany({ habitId: req.params.id });

        res.json({ msg: 'Habit removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/habits/:id/toggle
// @desc    Toggle habit completion for a date
// @access  Private
router.post('/:id/toggle', auth, async (req, res) => {
    const { date } = req.body; // YYYY-MM-DD

    try {
        let habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ msg: 'Habit not found' });
        if (habit.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        // Check if log exists
        const log = await HabitLog.findOne({
            habitId: req.params.id,
            date: date
        });

        if (log) {
            // If exists, remove it (toggle off)
            await HabitLog.findByIdAndDelete(log.id);
            res.json({ msg: 'Toggled off', state: 'uncompleted', habitId: req.params.id, date });
        } else {
            // Create new log
            const newLog = new HabitLog({
                habitId: req.params.id,
                userId: req.user.id,
                date: date,
                completed: true
            });
            await newLog.save();
            res.json({ msg: 'Toggled on', state: 'completed', habitId: req.params.id, date });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
