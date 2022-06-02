import mongoose from 'mongoose';

const { Schema } = mongoose;

const scoreSchema = new Schema({
  movieId: {
    type: Schema.ObjectId,
    ref: 'Movies',
  },
  starScores: [{
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

const Model = mongoose.model('StarScore', scoreSchema);
export default Model;
