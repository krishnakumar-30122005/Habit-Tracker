import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

export default mongoose.model('User', UserSchema);
