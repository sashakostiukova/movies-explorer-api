const express = require('express');
const { json } = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { config } = require('./config');
const { router } = require('./routes');
const { handleError } = require('./middlewares/handleError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(config.MONGO_URL);

app.use(cors());

app.use(json());
app.use(helmet());

app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

// app.listen(config.PORT);

app.listen(config.PORT, () => {
  console.log(`Server listen port ${config.PORT}`);
});
