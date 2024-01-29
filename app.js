const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/notFoundError');

const app = express();
const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(helmet());
app.post('/signin', login);
app.post('/signup', createUser);
app.use(userRouter);
app.use(cardRouter);
app.use(errors());
app.use(auth);
app.use('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка по умолчанию'
        : message,
    });

  next();
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
