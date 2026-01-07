import mongoose from 'mongoose';

const FocusSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    category: {
        type: String,
        enum: ['study', 'work', 'reading', 'meeting'],
        default: 'study'
    }
}, { timestamps: true });

export default mongoose.model('FocusSession', FocusSessionSchema);
