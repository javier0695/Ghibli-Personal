import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoreSchema = new Schema({
  movieId: {
    type: Schema.ObjectId,
    ref: 'Movies',
  },
  emojiScores: [{
    userId: {
      type: Schema.ObjectId,
      ref: 'User',
    },
    score: {
      type: Number,
      required: true,
    },
  }],
});

const model = mongoose.model('EmojiScore', scoreSchema);
export default model;
