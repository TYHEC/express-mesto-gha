const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя должно быть заполнено'],
    minlength: [2, 'Имя не может быть короче 2 символов'],
    maxlength: [30, 'Имя не может быть длиннее 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Информация о себе должна быть заполнена'],
    minlength: [2, 'Информация о себе не может быть короче 2 символов'],
    maxlength: [30, 'Информация о себе не может быть длиннее 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Ссылка на аватар должна быть заполнена'],
  },
});

module.exports = mongoose.model('user', userSchema);
