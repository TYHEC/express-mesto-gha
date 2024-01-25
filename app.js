const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();
const { PORT = 3000 } = process.env;
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(helmet());
app.use((req, res, next) => {
  req.user = {
    _id: '65b049e2b23cee5b749621b1',
  };

  next();
});
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res
    .status(404)
    .send({ message: 'Такой страницы не существует' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
