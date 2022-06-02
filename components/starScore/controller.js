import {
  hasStarScore as _hasStarScore, updateScore, addNewScore, getScoreByUser,
} from './store';
import { existMovie, getMovies } from '../movies/store';
import { getUserById } from '../user/store';
import { getScoreByUser as _getScoreByUser } from '../emojiScore/store';

const addStarScore = async (score, user) => {
  try {
    try {
      await existMovie(score.movieId);
    } catch (error) {
      throw new Error(`No se encontro una pelicula con este id  ${score.movieId}`);
    }
    const hasStarScore = await _hasStarScore(score, user);
    if (hasStarScore) {
      await updateScore(score, user);
    } else {
      await addNewScore(score, user);
    }

    const userFind = await getUserById(user._id);
    const { watchedMovies } = userFind;

    const scoreStarFind = await getScoreByUser(score.movieId, user._id);
    const scoreEmojiFind = await _getScoreByUser(score.movieId, user._id);

    const actualMovie = await getMovies(score.movieId);

    return {
      ...actualMovie[0],
      userStarScore: scoreStarFind,
      userEmojiScore: scoreEmojiFind,
      watched: watchedMovies.includes(score.movieId),
    };
  } catch (error) {
    console.log(error);
    throw ('No se pudieron obtener los datos');
  }
};

export default addStarScore;
