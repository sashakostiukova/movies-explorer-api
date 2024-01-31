const userRouter = require('express').Router();
const { celebrate } = require('celebrate');
const { userUpdateSchema } = require('../utils/validationSchemas');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

userRouter.get('/me', getUser);
userRouter.patch('/me', celebrate({ body: userUpdateSchema }), updateUser);

module.exports = { userRouter };
