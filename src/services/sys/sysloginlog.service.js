const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');

/**
 * sysLog get all
 * @param {Object} SysLogBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_Login_Log.findMany();
};

/**
 * pagination for sysLoginLogs
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

  const count = await prisma.Sys_Login_Log.count({ where: filter });

  const sysLoginLogs = await prisma.Sys_Login_Log.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return { isok: true, total: count, data: sysLoginLogs };
};

/**
 * Get sysLog by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysLog>}
 */
const getsysLogById = async (cGuid) => {
  return prisma.Sys_Login_Log.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Create sysLog with createBody
 * @param {Object} createBody
 * @returns {Promise<sysLog>}
 */
const addsysLog = async (createBody) => {
  const sysLog = await prisma.Sys_Login_Log.create({
    data: createBody,
  });
  return sysLog;
};

/**
 * Update sysLog by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysLog>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysLog = await getsysLogById(cGuid);
  if (!sysLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysLog not found');
  }
  Object.assign(sysLog, updateBody);
  await prisma.Sys_Login_Log.updateMany({
    data: updateBody,
    where: {
      cGuid,
    },
  });
  return sysLog;
};

/**
 * Delete sysLog by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysLog>}
 */
const deletesysLogById = async (cGuid) => {
  const sysLog = await getsysLogById(cGuid);
  if (!sysLog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysLog not found');
  }

  await prisma.Sys_Login_Log.delete({
    where: { cGuid },
  });

  return sysLog;
};

module.exports = {
  getall,
  pagination,
  getsysLogById,
  addsysLog,
  updatebyid,
  deletesysLogById,
};
