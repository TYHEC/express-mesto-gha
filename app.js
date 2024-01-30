const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/notFoundError');

const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);
app.use(errors());
app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });

  next();
});
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
