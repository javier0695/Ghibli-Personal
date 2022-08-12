import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import {
  getUser, addUser as _addUser, updateUser as _updateUser, getUserById,
} from './store';

const nodemailer = require('nodemailer');

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
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );

    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
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
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );

    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
      token,
    };
  } catch (error) {
    console.log(error);
    throw ('Datos incorrectos');
  }
}

async function findByEmail(userFind) {
  try {
    if (!userFind.email) {
      throw ('No se ingresaron los datos correctos');
    }

    const user = await getUser(userFind);

    if (!user) {
      throw ('Este usuario no existe');
    }

    delete user._doc.password;
    const token = sign(
      {
        _id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );

    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
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
      role: user.role,
      recoveryToken: user.token,
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
          role: user.role,
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
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
    );
    return {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      watchedMovies: user.watchedMovies.length,
      token,
    };
  } catch (error) {
    console.log(error);
    throw (error);
  }
}

async function sendMail(infoMail) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: true,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail(infoMail);
  return { message: 'mail sent' };
}

async function changePassword(token, newPassword) {
  try {
    const payload = verify(token, process.env.JWT_SECRET);
    const user = await getUserById(payload._id);

    if (user.recoveryToken !== token) {
      console.log(error);
      throw (error);
    }

    const data = {
      password: await hash(newPassword, 10),
      recoveryToken: null,
    };
    await _updateUser(user.id, data);
    return { message: 'password changed' };
  } catch (error) {
    console.log(error);
    throw (error);
  }
}

async function sendRecovery(foundUser) {
  const data = foundUser.email;
  const token = sign(
    {
      _id: foundUser._id,
      role: foundUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15min' },
  );
  const link = `https://estudio-ghibli-2022.herokuapp.com/recovery?token=${token}`;

  const userID = foundUser._id;
  const newData = {
    ...data,
    recoveryToken: token,
  };
  const user = await _updateUser(userID, newData);
  delete user._doc.password;

  const mail = {
    from: process.env.EMAIL_USER,
    to: foundUser.email,
    subject: 'Password recovery',
    html: `<b>Ingresa a este link => ${link}</b>`,
  };
  const rta = await sendMail(mail);
  return rta;
}

export {
  addUser,
  findUser,
  updateUser,
  findOrCreate,
  sendMail,
  findByEmail,
  sendRecovery,
  changePassword,
};