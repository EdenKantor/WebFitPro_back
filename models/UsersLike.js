import mongoose from 'mongoose';

const UsersLikeSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  url: {
    type: [String], // Array of url containing all the videos the user liked
    required: true,
  },
});

export default mongoose.models.UsersLike || mongoose.model('UsersLike', UsersLikeSchema);
