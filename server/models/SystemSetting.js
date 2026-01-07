import mongoose from 'mongoose';

const SystemSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    description: String,
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Helper to get a setting by key with a default value
SystemSettingSchema.statics.get = async function (key, defaultValue) {
    const setting = await this.findOne({ key });
    return setting ? setting.value : defaultValue;
};

// Helper to set a setting
SystemSettingSchema.statics.set = async function (key, value, userId) {
    return await this.findOneAndUpdate(
        { key },
        { value, updatedBy: userId },
        { upsert: true, new: true }
    );
};

const SystemSetting = mongoose.model('SystemSetting', SystemSettingSchema);
export default SystemSetting;
