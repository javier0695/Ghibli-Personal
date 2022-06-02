import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePic: String,
  watchedMovies: [{
    type: Schema.ObjectId,
    ref: 'Movies',
  }],
});

const model = mongoose.model('Users', userSchema);
export default model;
