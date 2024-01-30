const mongoose = require('mongoose');
const { regular } = require('../middlewares/validation');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
      required: [true, 'Название должно быть заполнено'],
    },
    link: {
      type: String,
      required: [true, 'Ссылка на картинку должна быть заполнена'],
      validate: {
        validator(url) {
          return regular.test(url);
        },
        message: 'Некорректный URL',
      },

    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);
module.exports = mongoose.model('card', cardSchema);
