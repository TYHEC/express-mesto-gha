const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const BadRequestError = require('../errors/badRequestError');
const ConflictError = require('../errors/conflictError');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch(next);
};
const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId).orFail(() => {
    throw new NotFoundError('Пользователь по указанному _id не найден');
  })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      if (error.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(error);
    });
};
const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => {
      res.status(200).send({
        data: {
          name, about, avatar, email,
        },
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(new ConflictError('Этот email уже зарегистрирован'));
      } if (error.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      next(error);
    });
};
const updateInfo = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res
      .status(200)
      .send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
      }
    })
    .catch(next);
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'KEY', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};
const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res
      .status(200)
      .send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } if (err.message === 'NotFoundError') {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateInfo, login, getCurrentUserInfo,
};
