import mongoose from 'mongoose';

const HabitLogSchema = new mongoose.Schema({
    habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    count: {
        type: Number,
        default: 1
    }
});

// index for fast lookups by habit and date
HabitLogSchema.index({ habitId: 1, date: 1 }, { unique: true });

export default mongoose.model('HabitLog', HabitLogSchema);
