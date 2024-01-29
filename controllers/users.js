const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
  User.findById(userId).orFail(() => new Error('NotFoundError'))
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: ' Пользователь по указанному _id не найден' });
      }
      if (error.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Передан не валидный ID' });
      }
      return next(error);
    });
};
const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => {
      res
        .status(201)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      if (error.code === 11000) {
        return res
          .status(409)
          .send({ message: 'Поьзователь с таким email уже зарегистрирован' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const updateInfo = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
    .then((user) => res
      .status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (err.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new Error('NotFoundError'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      return res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};
const getCurrentUserInfo = (req, res) => {
  const { userId } = req.params;
  User.findById(userId).orFail(() => new Error('NotFoundError'))
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: ' Пользователь по указанному _id не найден' });
      }
      if (error.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Передан не валидный ID' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateInfo, login, getCurrentUserInfo,
};
