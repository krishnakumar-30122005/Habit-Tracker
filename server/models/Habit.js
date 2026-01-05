import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['health', 'learning', 'productivity', 'mindset', 'lifestyle'],
        default: 'health'
    },
    timeOfDay: {
        type: String,
        enum: ['anytime', 'morning', 'afternoon', 'evening'],
        default: 'anytime'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly'],
        default: 'daily'
    },
    targetCount: {
        type: Number,
        default: 1
    },
    streak: {
        type: Number,
        default: 0
    },
    bestStreak: {
        type: Number,
        default: 0
    },
    archived: {
        type: Boolean,
        default: false
    },
    createdDt: {
        type: Date,
        default: Date.now
    },
    // We can store logs as a sub-collection or separate collection. 
    // For simplicity in MERN, referencing a separate 'Log' model is cleaner for scaling,
    // but embedding logs for a habit might be okay if they don't grow infinitely.
    // However, the current frontend uses a separate logs array logic.
    // Let's create a separate Log model or just query efficiently. 
    // Actually, let's keep it simple: HabitLog model.
});

export default mongoose.model('Habit', HabitSchema);
