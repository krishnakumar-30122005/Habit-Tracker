import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './server/models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habit-tracker');
        console.log('MongoDB Connected');

        const email = 'admin@example.com';
        const password = 'password123';
        const name = 'Admin User';

        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} updated to admin.`);
        } else {
            user = new User({
                name,
                email,
                password,
                role: 'admin'
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            console.log(`Admin user ${email} created.`);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
