const Joi = require('joi');

const getall = {
  query: Joi.object().keys({}),
};

const get = {
  query: Joi.object().keys({
    cName: Joi.string().optional().allow(''),
    orderBy: Joi.string().optional().valid('asc', 'desc'),
    row: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getById = {
  params: Joi.object().keys({
    cGuid: Joi.string().required(),
  }),
};

const create = {
  body: Joi.object().keys({
    cName: Joi.string().max(50).required(),
    cCreateUserGuid: Joi.string().guid().optional(),
    cCreateUserId: Joi.string().optional(),
    cCreateUserName: Joi.string().optional(),
    dCreateTime: Joi.string().optional(),
    cModifyUserGuid: Joi.string().guid().optional(),
    cModifyUserId: Joi.string().max(155).optional(),
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
      cCreateUserGuid: Joi.string().guid().optional(),
      cCreateUserId: Joi.string().optional(),
      cCreateUserName: Joi.string().optional(),
      dCreateTime: Joi.string().optional(),
      cModifyUserGuid: Joi.string().guid().optional(),
      cModifyUserId: Joi.string().max(155).optional(),
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

const getTreeNodes = {
  query: Joi.object().keys({}),
};

module.exports = {
  getall,
  get,
  getById,
  create,
  updateById,
  deleteById,
  getTreeNodes
};
