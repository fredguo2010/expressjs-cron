const meterRoute = require('./meter.route');
const subsituteRoute = require('./subsitute.route');
const positionRoute = require('./position.route');
const subItemRoute = require('./subitem.route');
const tagRoute = require('./tag.route');
const rawRecordRoute = require('./rawrecord.route');
const defaultRoutes = [
  {
    path: '/ems/meter',
    route: meterRoute,
  },
  {
    path: '/ems/subsitute',
    route: subsituteRoute,
  },
  {
    path: '/ems/position',
    route: positionRoute,
  },
  {
    path: '/ems/subitem',
    route: subItemRoute,
  },
  {
    path: '/ems/tag',
    route: tagRoute,
  },
  {
    path: '/ems/rawrecord',
    route: rawRecordRoute
  }
];

module.exports = defaultRoutes;
