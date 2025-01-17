import mongoose from 'mongoose';

const UserSessionSchema = new mongoose.Schema({

    userName: {
        type: String,
    },
    videos: {
    type: [String], // Array of url containing all current workout the user need to do
    },
    checks: {
    type: [Boolean], // Array of boolean values, indicate what video user complete
    },
    completesessions: {
        type: Number,
    },
    openedsessions: {
        type: Number,
    },
    finished:{
        type: Boolean,
    }

});

export default mongoose.models.UserSession || mongoose.model('UserSession', UserSessionSchema);
