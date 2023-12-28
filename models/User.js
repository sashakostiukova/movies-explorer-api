const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: {
        value: true,
        message: 'Поле email является обязательным',
      },
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: {
        value: true,
        message: 'Поле password является обязательным',
      },
      select: false,
    },
    name: {
      type: String,
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('user', userSchema);
