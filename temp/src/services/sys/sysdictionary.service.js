const httpStatus = require('http-status');
// const { sysDictionary } = require('../models');
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');

/**
 * SysDictionary get all
 * @param {Object} SysDictionaryBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_Dictionary.findMany();
};

/**
 * pagination for sysDictionarys
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.orderBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.row] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const pagination = async (filter, options) => {
  const page = Number(options.page) || 1;
  const row = Number(options.row) || 5;
  const { orderBy } = options;
  let orderByObj = {};
  if (orderBy) {
    const [key, value] = orderBy.split(':');
    orderByObj = {
      [key]: value,
    };
  }

  const count = await prisma.Sys_Dictionary.count({ where: filter });

  const sysDictionarys = await prisma.Sys_Dictionary.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return { isok: true, total: count, data: sysDictionarys };
};

/**
 * Get sysDictionary by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysDictionary>}
 */
const getsysDictionaryById = async (cGuid) => {
  return prisma.Sys_Dictionary.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Create sysDictionary with createBody
 * @param {Object} createBody
 * @returns {Promise<sysDictionary>}
 */
const addsysDictionary = async (createBody) => {
  const sysDictionary = await prisma.Sys_Dictionary.create({
    data: createBody,
  });
  return sysDictionary;
};

/**
 * Update sysDictionary by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysDictionary>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysDictionary = await getsysDictionaryById(cGuid);
  if (!sysDictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysDictionary not found');
  }
  Object.assign(sysDictionary, updateBody);
  await prisma.Sys_Dictionary.updateMany({
    data: updateBody,
    where: {
      cGuid,
    },
  });
  return sysDictionary;
};

/**
 * Delete sysDictionary by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysDictionary>}
 */
const deletesysDictionaryById = async (cGuid) => {
  const sysDictionary = await getsysDictionaryById(cGuid);
  if (!sysDictionary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysDictionary not found');
  }

  await prisma.Sys_Dictionary.delete({
    where: { cGuid },
  });

  return sysDictionary;
};

module.exports = {
  getall,
  pagination,
  getsysDictionaryById,
  addsysDictionary,
  updatebyid,
  deletesysDictionaryById,
};
