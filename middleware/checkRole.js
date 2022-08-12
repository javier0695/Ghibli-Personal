import { verify } from 'jsonwebtoken';
import { error as _error } from '../network/response';

function checkRole(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token && req.body.role === 'admin') {
    return _error(req, res, 'No se pudo autenticar', 400, 'Token no enviado');
  }

  let userFind = '';

  if (token && req.body.role === 'admin') {
    try {
      userFind = verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return _error(req, res, 'No se pudo autenticar', 400, 'Error interno al autenticar');
    }
  }

  if (userFind.role !== 'admin' && Array.isArray(req.body)) {
    try {
      userFind = verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return _error(req, res, 'No se pudo autenticar', 400, 'Error interno al autenticar');
    }
  }

  if (!userFind._id && req.body.role === 'admin') {
    return _error(req, res, 'No se pudo autenticar', 400, 'El _id no se encuentra en el token');
  }

  if (userFind.role !== 'admin' && req.body.role === 'admin') {
    return _error(req, res, 'Not allowed', 400, 'El usuario no es admin');
  }

  if (userFind.role !== 'admin' && Array.isArray(req.body)) {
    return _error(req, res, 'Not allowed', 400, 'El usuario no es admin');
  }

  req.user = userFind;
  return next();
}

export default checkRole;