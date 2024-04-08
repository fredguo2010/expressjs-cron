const Joi = require('joi');

const getRecentRawRecordsByTagId = {
  query: Joi.object().keys({
    cTagId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
  }),
};

const getOmniHoraRawRecordsByTagId = {
  query: Joi.object().keys({
    cTagId: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
  }),
};

module.exports = {
  getRecentRawRecordsByTagId,
  getOmniHoraRawRecordsByTagId,
};
