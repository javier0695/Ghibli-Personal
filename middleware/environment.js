import { error as _error } from '../network/response';

function verifyEnvironment(req, res, next) {
  const env = process.env.NODE_ENV;

  if (!env) {
    return _error(req, res, 'No tiene acceso a este endpoint', 400, 'Especifice en que entorno se encuentra');
  }

  if (env === 'development') {
    return next();
  }
  return _error(req, res, 'No tiene acceso a este endpoint', 400, 'Solo se puede hacer en desarrollo');
}

export default verifyEnvironment;
