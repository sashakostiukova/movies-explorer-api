const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const {
  SUCCESS_CODE_OK,
  SUCCESS_CODE_CREATED,
  MONGO_DUPLACATE_ERROR_CODE,
} = require('../utils/codes');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NotAuthentificatedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по id не найден');
    }
    return res
      .status(SUCCESS_CODE_OK)
      .send(
        {
          email: user.email, name: user.name,
        },
      );
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      email, password, name,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const newUser = await new User({
      email, password: hash, name,
    });
    await newUser.save();
    return res
      .status(SUCCESS_CODE_CREATED)
      .send({
        email: newUser.email,
        name: newUser.name,
      });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации полей'));
    } else if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(error);
    }
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const id = req.user._id;
    const updatedUser = await User
      .findByIdAndUpdate(id, { email, name }, { new: true, runValidators: true });
    return res
      .status(SUCCESS_CODE_OK)
      .send({
        email: updatedUser.email,
        name: updatedUser.name,
      });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Ошибка валидации полей'));
    } else if (error.code === MONGO_DUPLACATE_ERROR_CODE) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    } else {
      next(error);
    }
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userAdmin = await User.findOne({ email })
      .select('+password')
      .orFail(() => new NotAuthentificatedError('Неправильный email или password'));

    const matched = await bcrypt.compare(String(password), userAdmin.password);
    if (!matched) {
      throw new NotAuthentificatedError('Неправильный email или password');
    }
    const token = generateToken({ _id: userAdmin._id });

    return res.send({ token });
  } catch (error) {
    next(error);
  }
};
