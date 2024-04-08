const express = require('express');
const docsRoute = require('./docs.route');
const config = require('../config/config');
const influxdbRoutes = require('./influxdb/index');
const emsRoutes = require('./ems/index');

const router = express.Router();

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

influxdbRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

emsRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
