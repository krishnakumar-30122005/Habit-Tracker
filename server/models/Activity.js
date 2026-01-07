import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['LEVEL_UP', 'CHALLENGE_JOIN', 'STREAK_MILESTONE'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    targetId: { // Optional ID, e.g., Challenge ID
        type: mongoose.Schema.Types.ObjectId
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

export default mongoose.model('Activity', ActivitySchema);
