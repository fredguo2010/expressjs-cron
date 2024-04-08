module.exports.authValidation = require('./auth.validation');
module.exports.userValidation = require('./user.validation');

module.exports.sysdictValidation = require('./sysdict.validation');
module.exports.syslogValidation = require('./syslog.validation');
module.exports.sysloginlogValidation = require('./sysloginlog.validation');
module.exports.sysmenuValidation = require('./sysmenu.validation');
module.exports.sysorgValidation = require('./sysorg.validation');
module.exports.sysroleValidation = require('./sysrole.validation');
module.exports.sysrolemenuValidation = require('./sysrolemenu.validation');
// InfluxDB Validation
module.exports.influxdbValidation = require('./influxdb/influxdb.validation');
// EMS Validation
module.exports.emsMeterValidation = require('./ems/meter.validation');
module.exports.emsSubsituteValidation = require('./ems/subsitute.validation');
module.exports.emsTagValidation = require('./ems/tag.validation');