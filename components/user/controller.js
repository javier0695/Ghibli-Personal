import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import {
  getUser, addUser as _addUser, updateUser as _updateUser, getUserById,
} from './store';

require('dotenv').config();

async function addUser(newUser) {
  try {
    if (!newUser.userName || !newUser.password || !newUser.email) {
      throw ('No se ingresaron los datos correctos');
    }

    const foundUser = await getUser(newUser);

    if (foundUser) {
      throw ('Este usuario ya existe');
    }

    const user = await _addUser(newUser);
    delete user._doc.password;
    const token = sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );

    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
      token,
    };
  } catch (error) {
    console.log(error);
    throw (error);
  }
}

async function findUser(userFind) {
  try {
    if (!userFind.email || !userFind.password) {
      throw ('No se ingresaron los datos correctos');
    }

    const user = await getUser(userFind);

    if (!user) {
      throw ('Este usuario no existe');
    }

    const valid = await compare(userFind.password, user.password);

    if (!valid) {
      throw ('Datos incorrectos');
    }
    delete user._doc.password;
    const token = sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );

    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
      token,
    };
  } catch (error) {
    console.log(error);
    throw ('Datos incorrectos');
  }
}

async function updateUser(userID, userData, profilePic) {
  try {
    const userFind = await getUserById(userID);

    let profilePicUrl = '';
    if (!userData.userName && !userData.newPassword && !profilePic) {
      throw ('No se ingresaron los datos correctos');
    }

    if (userData.newPassword) {
      const valid = await compare(userData.oldPassword, userFind.password);

      if (!valid) {
        throw ('La contraseña no coincide');
      }
    }

    if (profilePic) {
      if (process.env.NODE_ENV === 'development') {
        profilePicUrl = `http://${process.env.HOST}:${process.env.PORT}/app/files/${profilePic.filename}`;
      } else {
        profilePicUrl = `https://${process.env.HOST}/app/files/${profilePic.filename}`;
      }
    }
    // Creating object to update information in the actual user.
    const data = {
      userName: userData.userName ? userData.userName : userFind.userName,
      profilePic: profilePic ? profilePicUrl : userFind.profilePic,
      password: userData.newPassword ? await hash(userData.newPassword, 10) : userFind.password,
    };

    const user = await _updateUser(userID, data);
    delete user._doc.password;
    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
    };
  } catch (error) {
    console.log(error);
    throw ('Datos incorrectos');
  }
}

async function findOrCreate(userFind) {
  try {
    let user = await getUser(userFind);
    if (!user) {
      try {
        const newUser = {
          userName: userFind.name,
          email: userFind.email,
          profilePic: userFind.picture.data.url,
        };
        user = await _addUser(newUser);
      } catch (error) {
        console.log(error);
        throw ('No se pudo obtener los suficientes datos');
      }
    }

    if (user.password) {
      delete user._doc.password;
    }

    const token = sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );
    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
      token,
    };
  } catch (error) {
    console.log(error);
    throw (error);
  }
}

export {
  addUser,
  findUser,
  updateUser,
  findOrCreate,
};
