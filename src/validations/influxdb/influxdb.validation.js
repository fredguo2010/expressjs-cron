const Joi = require('joi');

const getInfluxDataByTagId = {
  query: Joi.object().keys({
    tagId: Joi.string().max(50).required(),
    start: Joi.string().max(50).required(),
    interval: Joi.string().max(50).required(),
    queryType: Joi.string().required().valid('mean', 'last'),
  }),
};

const getInfluxDataByDeviceAndName = {
  query: Joi.object().keys({
    device: Joi.string().max(255).required(),
    name: Joi.string().max(255).required(),
    start: Joi.string().max(50).required(),
    interval: Joi.string().max(50).required(),
    queryType: Joi.string().required().valid('mean', 'last'),
  }),
};

module.exports = {
  getInfluxDataByTagId,
  getInfluxDataByDeviceAndName
}