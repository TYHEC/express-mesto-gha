const express = require('express');
const {
  getUsers, getUserById, createUser, updateAvatar, updateInfo,
} = require('../controllers/users');

const userRouter = express.Router();
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me/avatar', updateAvatar);
userRouter.patch('/users/me', updateInfo);
module.exports = { userRouter };
