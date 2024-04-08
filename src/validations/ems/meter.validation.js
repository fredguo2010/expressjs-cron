const Joi = require('joi');

const getall = {
  query: Joi.object().keys({}),
};

const getMeter = {
  query: Joi.object().keys({
    cName: Joi.string().optional().allow(''),
    cPositionFk: Joi.string().optional().allow(''),
    cSubsituteFk: Joi.string().optional().allow(''),
    cSubItemFk: Joi.string().optional().allow(''),
    orderBy: Joi.string().optional().valid('asc', 'desc'),
    row: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getEmsMeterById = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
};

const createEmsMeter = {
  body: Joi.object().keys({
    cName: Joi.string().max(50).required(),
    cModel: Joi.string().max(50).optional(),
    cManufacturer: Joi.string().max(50).optional(),
    cPositionFk: Joi.string().guid().optional(),
    cSubsituteFk: Joi.string().guid().optional(),
    cSubItemFk: Joi.string().guid().optional(),
    cReturnZero: Joi.number().integer().optional(),
    cCreateUserGuid: Joi.string().guid().optional(),
    cCreateUserId: Joi.string().optional(),
    cCreateUserName: Joi.string().optional(),
    dCreateTime: Joi.string().optional(),
    cModifyUserGuid: Joi.string().guid().optional(),
    cModifyUserId: Joi.string().max(20).optional(),
    cModifyUserName: Joi.string().max(50).optional(),
    dModifyTime: Joi.string().optional(),
  }),
};

const updateById = {
  params: Joi.object().keys({
    cGuid: Joi.required(),
  }),
  body: Joi.object()
    .keys({
      cName: Joi.string().max(50).required(),
      cModel: Joi.string().max(50).optional(),
      cManufacturer: Joi.string().max(50).optional(),
      cPositionFk: Joi.string().guid().optional(),
      cSubsituteFk: Joi.string().guid().optional(),
      cSubItemFk: Joi.string().guid().optional(),
      cReturnZero: Joi.number().integer().optional(),
      cCreateUserGuid: Joi.string().guid().optional(),
      cCreateUserId: Joi.string().optional(),
      cCreateUserName: Joi.string().optional(),
      dCreateTime: Joi.string().optional(),
      cModifyUserGuid: Joi.string().guid().optional(),
      cModifyUserId: Joi.string().max(50).optional(),
      cModifyUserName: Joi.string().max(50).optional(),
      dModifyTime: Joi.string().optional(),
    })
    .min(1),
};

const deleteById = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
};

module.exports = {
  getall,
  getMeter,
  getEmsMeterById,
  createEmsMeter,
  updateById,
  deleteById,
};
