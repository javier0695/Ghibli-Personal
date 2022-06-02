import {
  hasEmojiScore as _hasEmojiScore, updateScore, addNewScore, getScoreByUser,
} from './store';
import { existMovie, getMovies } from '../movies/store';
import { getUserById } from '../user/store';
import { getScoreByUser as _getScoreByUser } from '../starScore/store';

const addEmojiScore = async (score, user) => {
  try {
    try {
      await existMovie(score.movieId);
    } catch (error) {
      throw new Error(`No se encontro una pelicula con este id  ${score.movieId}`);
    }

    const hasEmojiScore = await _hasEmojiScore(score, user);
    if (hasEmojiScore) {
      await updateScore(score, user);
    } else {
      await addNewScore(score, user);
    }

    const userFind = await getUserById(user._id);
    const { watchedMovies } = userFind;

    const scoreStarFind = await _getScoreByUser(score.movieId, user._id);
    const scoreEmojiFind = await getScoreByUser(score.movieId, user._id);

    const actualMovie = await getMovies(score.movieId);

    return {
      ...actualMovie[0],
      userStarScore: scoreStarFind,
      userEmojiScore: scoreEmojiFind,
      watched: watchedMovies.includes(score.movieId),
    };
  } catch (error) {
    console.log(error);
    throw new Error('No se pudieron obtener los datos');
  }
};

export default addEmojiScore;
