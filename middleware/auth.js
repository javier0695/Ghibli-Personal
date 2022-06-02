import { verify } from 'jsonwebtoken';
import { error as _error } from '../network/response';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return _error(req, res, 'No se pudo autenticar', 400, 'Token no enviado');
  }

  let userFind = '';
  try {
    userFind = verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return _error(req, res, 'No se pudo autenticar', 400, 'Error interno al autenticar');
  }

  if (!userFind._id) {
    return _error(req, res, 'No se pudo autenticar', 400, 'El _id no se encuentra en el token');
  }

  req.user = userFind;
  return next();
}

export default authenticate;
