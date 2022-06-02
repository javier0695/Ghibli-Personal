import Model from './model';

async function hasStarScore(starScore, user) {
  try {
    const findScore = await Model.exists({
      movieId: starScore.movieId,
      starScores: { $elemMatch: { userId: user._id } },
    });
    return findScore;
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }
}

async function addNewScore(starScore, user) {
  const newScore = {
    userId: user._id,
    score: starScore.score,
  };

  try {
    await Model.updateOne(
      {
        movieId: starScore.movieId,
      },
      {
        $push: {
          starScores: {
            ...newScore,
          },
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }

  return newScore;
}

async function updateScore(starScore, user) {
  const newScore = {
    userId: user._id,
    score: starScore.score,
  };
  try {
    await Model.updateOne(
      {
        movieId: starScore.movieId,
        starScores: { $elemMatch: { userId: newScore.userId } },
      },
      {
        $set: {
          'starScores.$.score': newScore.score,
        },
      },
      { new: true },
    );
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }
}

async function getScoreByUser(movieID, userID) {
  try {
    const score = await Model.findOne({ movieId: movieID, starScores: { $elemMatch: { userId: userID } } })
      .select({ starScores: { $elemMatch: { userId: userID } } });
    if (score) {
      return score.starScores[0].score;
    }
    return 0;
  } catch (error) {
    console.log(error);
    throw ('Unexpected error');
  }
}

export {
  hasStarScore,
  addNewScore,
  updateScore,
  getScoreByUser,
};
