const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'", 'localhost:3000', 'sso.rockii-innovation.cn'],
        frameSrc: ["'self'", 'sso.rockii.cn', 'sso.rockii-innovation.cn'],
        scriptSrc: ["'self'", "'unsafe-inline'", `blob:`],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", `data:`, `blob:`],
      },
    },
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/auth', authLimiter);
}

// v1 api routes
app.use('/api', routes);

// 配置静态资源 public文件夹中
const wwwDir = path.resolve(process.cwd(), 'www');
const ioadmin = path.join(wwwDir, 'ioadminui/');
app.use('/api/uploads', express.static('./uploads'));
app.use('/', express.static(wwwDir));
app.use('/socketio/admin', express.static(ioadmin));

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
