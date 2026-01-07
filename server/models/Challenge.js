import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    category: {
        type: String,
        enum: ['academic', 'mindfulness', 'fitness', 'productivity', 'social', 'health'],
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    icon: {
        type: String, // Emoji or icon name
        default: '🏆'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('Challenge', ChallengeSchema);
