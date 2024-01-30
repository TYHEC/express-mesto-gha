const express = require('express');
const {
  getUsers, getUserById, updateAvatar, updateInfo, getCurrentUserInfo,
} = require('../controllers/users');

const userRouter = express.Router();
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.patch('/users/me/avatar', updateAvatar);
userRouter.patch('/users/me', updateInfo);
module.exports = { userRouter };
