const Joi = require('joi');

const getall = {
  query: Joi.object().keys({}),
};

const get = {
  query: Joi.object().keys({
    cName: Joi.string().optional().allow(''),
    cMeterFk: Joi.string().optional().allow(''),
    iStatus: Joi.boolean().optional().allow(true),
    orderBy: Joi.string().optional().valid('asc', 'desc'),
    row: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateFriendlyName = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
  body: Joi.object().keys({
    cFriendlyName: Joi.string().required(),
  }),
};

const getById = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
};

const deleteById = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
};

const bindWithMeter = {
  body: Joi.object().keys({
    cMeterGuid: Joi.string().guid().required(),
    device: Joi.object().keys({
      id: Joi.string().required(),
      name: Joi.string().required(),
      address: Joi.string().required().allow(''),
    }),
    tags: Joi.array().items(
      Joi.object().keys({
        id: Joi.string().required(),
        type: Joi.string().required(),
        name: Joi.string().required(),
        address: Joi.string().required().allow(''),
        memaddress: Joi.string().required().allow(''),
      })
    ),
    userId: Joi.string().required(),
  }),
};

const getTagsByDeviceId = {
  query: Joi.object().keys({
    deviceId: Joi.string().required().allow(''),
  }),
};

const getTagsByMeterFk = {
  query: Joi.object().keys({
    cMeterFk: Joi.string().required().allow(''),
  }),
};

module.exports = {
  getall,
  get,
  getById,
  updateFriendlyName,
  deleteById,
  bindWithMeter,
  getTagsByDeviceId,
  getTagsByMeterFk,
};
