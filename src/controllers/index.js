module.exports.authController = require('./auth.controller');
module.exports.userController = require('./user.controller');

// sys
module.exports.sysdictController = require('./sys/sysdictionary.controller');
module.exports.syslogController = require('./sys/syslog.controller');
module.exports.sysloginlogController = require('./sys/sysloginlog.controller');
module.exports.sysmenuController = require('./sys/sysmenu.controller');
module.exports.sysorgController = require('./sys/sysorg.controller');
module.exports.sysroleController = require('./sys/sysrole.controller');
module.exports.sysrolemenuController = require('./sys/sysrolemenu.controller');
module.exports.sysuserController = require('./sys/sysuser.controller');

// EMS
module.exports.emsMeterController = require('./ems/meter.controller');
module.exports.emsSubsituteController = require('./ems/subsitute.controller');
module.exports.emsPositionController = require('./ems/position.controller');
module.exports.emsSubItemController = require('./ems/subitem.controller');
module.exports.emsTagController = require('./ems/tag.controller');
module.exports.emsRawRecordController = require('./ems/rawrecord.controller');