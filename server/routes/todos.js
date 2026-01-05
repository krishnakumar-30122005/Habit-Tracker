
import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth.js';
import Todo from '../models/Todo.js';

// @route   GET api/todos
// @desc    Get all todos for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/todos
// @desc    Add new todo
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, date } = req.body;

    try {
        const newTodo = new Todo({
            title,
            date,
            userId: req.user.id
        });

        const todo = await newTodo.save();
        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/todos/:id
// @desc    Update todo (toggle completion or edit title)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, completed, date } = req.body;

    const todoFields = {};
    if (title !== undefined) todoFields.title = title;
    if (completed !== undefined) todoFields.completed = completed;
    if (date !== undefined) todoFields.date = date;

    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        if (todo.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { $set: todoFields },
            { new: true }
        );

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ msg: 'Todo not found' });

        if (todo.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Todo.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
