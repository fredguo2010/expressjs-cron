const { createServer } = require('http');
const { Server } = require('socket.io');
const { socketio } = require('./core/socketio');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const httpServer = createServer(app);
const cron = require('./core/cron');

const io = new Server(httpServer, {
  cors: {
    origin: ['https://admin.socket.io', 'http://localhost:3000', 'http://localhost:4200'],
    credentials: true,
  },
});
socketio.init(io);

// Init Cron Task
cron.initCron();

// mqtt client
// mqttclient.init('mqtt://mqtt.raiad.cn:1883');

const server = httpServer.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
