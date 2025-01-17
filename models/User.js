import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
  },
  isAdmin: {
    type: String,
  },
  isRegistered: {
    type: String,
  },
  password: {
    type: String,
  },
  weight: {
    type: Number,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
