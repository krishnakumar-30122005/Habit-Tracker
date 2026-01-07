import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resetDB = async () => {
    try {
        console.log('🔄 Connecting to Cloud DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected');

        console.log('🗑️ Deleting all generic challenges...');
        // We only delete challenges so they can be re-seeded
        const result = await mongoose.connection.collection('challenges').deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} old challenges.`);
        console.log('🚀 Ready to seed Student Challenges on next refresh.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

resetDB();
