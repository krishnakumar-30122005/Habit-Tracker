import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/habit-tracker', {
    serverSelectionTimeoutMS: 30000 // Wait 30s before failing
})
    .then(() => {
        console.log('✅ MongoDB Connected (Cloud)');
        // Start Server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        console.error('If you are on a blocked network, this will fail.');
        process.exit(1);
    });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/todos', (await import('./routes/todos.js')).default);
app.use('/api/ai', (await import('./routes/ai.js')).default);
app.use('/api/admin', (await import('./routes/admin.js')).default);
app.use('/api/social', (await import('./routes/social.js')).default);
app.use('/api/focus', (await import('./routes/focus.js')).default);

// Catch-all handler for any request that doesn't match the above
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Server started inside startServer() 

