const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');

/**
 * sysRole get all
 * @param {Object} SysRoleBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  const orderByObj = {
    cRoleCode: 'asc',
  };
  return prisma.Sys_Role.findMany({
    orderBy: orderByObj,
  });
};

/**
 * pagination for sysRoles
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
  } else {
    orderByObj = {
      cRoleCode: 'asc',
    };
  }

  const sysRoles = await prisma.Sys_Role.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return sysRoles;
};

/**
 * Get sysRole by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysRole>}
 */
const getsysRoleById = async (cGuid) => {
  return prisma.Sys_Role.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Create sysRole with createBody
 * @param {Object} createBody
 * @returns {Promise<sysRole>}
 */
const addsysRole = async (createBody) => {
  const sysRole = await prisma.Sys_Role.create({
    data: createBody,
  });
  return sysRole;
};

/**
 * Update sysRole by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysRole>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysRole = await getsysRoleById(cGuid);
  if (!sysRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysRole not found');
  }
  Object.assign(sysRole, updateBody);
  await prisma.Sys_Role.updateMany({
    data: updateBody,
    where: {
      cGuid,
    },
  });
  return sysRole;
};

/**
 * Delete sysRole by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysRole>}
 */
const deletesysRoleById = async (cGuid) => {
  const sysRole = await getsysRoleById(cGuid);
  if (!sysRole) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysRole not found');
  }

  await prisma.Sys_Role.delete({
    where: { cGuid },
  });

  return sysRole;
};

module.exports = {
  getall,
  pagination,
  getsysRoleById,
  addsysRole,
  updatebyid,
  deletesysRoleById,
};
