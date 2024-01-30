const express = require('express');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, updateCardValidation } = require('../middlewares/validation');

const cardRouter = express.Router();
cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCardValidation, createCard);
cardRouter.delete('/cards/:cardId', updateCardValidation, deleteCard);
cardRouter.put('/cards/:cardId/likes', updateCardValidation, likeCard);
cardRouter.delete('/cards/:cardId/likes', updateCardValidation, dislikeCard);
module.exports = { cardRouter };
