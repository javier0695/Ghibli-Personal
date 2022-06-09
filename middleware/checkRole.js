import {error as _error} from '../network/response';

function checkRole(req, res , next){
    const user = req.user;
    if(user._role === 'admin'){
        return next()
    }else{
        return_error(req, res, 'not allowed', 400, 'User role is not admin');
    }
}

export default checkRole;
