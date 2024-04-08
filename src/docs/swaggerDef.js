const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'TWAD EMS Backend API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://gitlab.raiad.cn/shanghai-iad-poc-group/poc-project/twad_ems/twad_ems_backend.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/`,
    },
  ],
};

module.exports = swaggerDef;
