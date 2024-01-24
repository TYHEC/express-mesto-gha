const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res
        .status(200)
        .send(users);
    })
    .catch(() => {
      res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const getUserById = (req, res) => {
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
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res
        .status(200)
        .send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
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
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } if (err.message === 'NotFoundError') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      res
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
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } if (err.message === 'NotFoundError') {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      res
        .status(500)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers, getUserById, createUser, updateAvatar, updateInfo,
};
