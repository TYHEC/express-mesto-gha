const express = require('express');
const {
  getUsers, getUserById, updateAvatar, updateInfo, getCurrentUserInfo,
} = require('../controllers/users');
const { updateAvatarValidation, updateInfoValidation, userIdValidation } = require('../middlewares/validation');

const userRouter = express.Router();
userRouter.get('/users/me', getCurrentUserInfo);
userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', userIdValidation, getUserById);
userRouter.patch('/users/me/avatar', updateAvatarValidation, updateAvatar);
userRouter.patch('/users/me', updateInfoValidation, updateInfo);
module.exports = { userRouter };
