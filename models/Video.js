import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  likeCount:{
    type: Number
  },
  difficulty: {
    type: String,
  },
  bodyPart: {
    type: String,
  },
  title: {
    type: String,
  },
});

export default mongoose.models.Video || mongoose.model('Video', VideoSchema);
