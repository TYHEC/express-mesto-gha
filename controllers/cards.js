const Cards = require('../models/card');

const getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res
      .status(200)
      .send(cards))
    .catch(() => res
      .status(500)
      .send({ message: 'Ошибка по умолчанию.' }));
};
const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => {
      res
        .status(200)
        .send(card);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  return Cards.findByIdAndDelete(cardId).orFail(() => new Error('NotFoundError'))
    .then((card) => res
      .status(200)
      .send(card))
    .catch((error) => {
      if (error.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (error.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const likeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('NotFoundError'))
    .then((card) => res
      .status(200)
      .send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные для постановки лайка' });
      } if (err.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
const dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error('NotFoundError'))
    .then((card) => res
      .status(200)
      .send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      } if (err.message === 'NotFoundError') {
        return res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
