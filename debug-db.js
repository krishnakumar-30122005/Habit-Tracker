import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log("------------------------------------------");
console.log("🛠️  DIAGNOSTIC: Testing MongoDB Connection...");
console.log("URI provided:", process.env.MONGODB_URI ? "YES (Hidden)" : "NO (Missing!)");
console.log("------------------------------------------");

// Test Options
const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s
    family: 4, // Force IPv4
};

async function testConnection() {
    try {
        console.log("Attempting to connect...");
        await mongoose.connect(process.env.MONGODB_URI, options);
        console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
        console.log("The credentials and whitelist are correct.");
        process.exit(0);
    } catch (error) {
        console.error("❌ FAILED: Could not connect.");
        console.error("------------------------------------------");
        console.error("Error Code:", error.code);
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);

        if (error.name === 'MongooseServerSelectionError') {
            console.log("\n⚠️  DIAGNOSIS: Network Block Detected");
            console.log("Your computer or internet is blocking port 27017.");
            console.log("Try connecting via a PHONE HOTSPOT to confirm.");
        }
        process.exit(1);
    }
}

testConnection();
