import mongoose from 'mongoose';
import Model from './model';

const { ObjectId } = mongoose.Types;

async function existMovie(movieID) {
  try {
    const exist = await Model.exists({ _id: movieID });
    return exist;
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }
}

async function addMovie(movie) {
  try {
    const newMovie = new Model(movie);
    newMovie.save();
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }
}

async function getMovies(movieID) {
  try {
    const pipeline = [];
    if (movieID) pipeline.push({ $match: { _id: ObjectId(movieID) } });
    pipeline.push(
      {
        $lookup: {
          from: 'starscores',
          localField: '_id',
          foreignField: 'movieId',
          as: 'starscore',
        },
      },
      {
        $replaceRoot: {
          newRoot:
          {
            $mergeObjects: [
              { $arrayElemAt: ['$starscore', 0] }, '$$ROOT',
            ],
          },
        },
      },
      {
        $lookup: {
          from: 'emojiscores',
          localField: '_id',
          foreignField: 'movieId',
          as: 'emojiscore',
        },
      },
      {
        $replaceRoot: {
          newRoot:
          {
            $mergeObjects: [
              { $arrayElemAt: ['$emojiscore', 0] }, '$$ROOT',
            ],
          },
        },
      },
      {
        $addFields: {
          avgEmojiScore: {
            $cond: { if: { $isArray: '$emojiScores' }, then: { $avg: '$emojiScores.score' }, else: 0 },
          },
          avgStarScore: {
            $cond: { if: { $isArray: '$starScores' }, then: { $avg: '$starScores.score' }, else: 0 },
          },
        },
      },
      {
        $project:
        {
          emojiscore: 0,
          emojiScores: 0,
          movieId: 0,
          __v: 0,
          starscore: 0,
          starScores: 0,
        },
      },
    );
    return await Model.aggregate(pipeline);
  } catch (error) {
    throw ('Unexpected error');
  }
}

export {
  addMovie,
  getMovies,
  existMovie,
};
