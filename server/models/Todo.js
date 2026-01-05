
import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    date: {
        type: String, // YYYY-MM-DD (optional, if daily specific)
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Todo', TodoSchema);
