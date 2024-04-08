const influxdbRoute = require('./influxdb.route');

const defaultRoutes = [
  {
    path: '/influxdb',
    route: influxdbRoute,
  },
];

module.exports = defaultRoutes;
