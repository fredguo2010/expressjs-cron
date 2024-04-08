const httpStatus = require('http-status');
// const { User } = require('../models');
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');

/**
 * sysuser get all
 * @param {Object} userBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_User.findMany();
};

/**
 * pagination for users
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

  const count = await prisma.Sys_User.count({
    where: filter,
  });

  const users = await prisma.Sys_User.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return { isok: true, total: count, data: users };
};

/**
 * Get user by userid
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserByUserId = async (id) => {
  return prisma.Sys_User.findFirst({
    where: {
      userid: id,
    },
  });
};

/**
 * Get user by id
 * @param {ObjectId} cGuid
 * @returns {Promise<User>}
 */
const getUserById = async (cGuid) => {
  return prisma.Sys_User.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.Sys_User.findFirst({ where: { email } });
};

/**
 * Update user by id
 * @param {ObjectId} userid
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatebyuserid = async (userid, updateBody) => {
  const user = await getUserByUserId(userid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userExist = await prisma.Sys_User.findFirst({
    where: {
      email: updateBody.email,
      userid: {
        not: userid,
      },
    },
  });
  if (updateBody.email && userExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await prisma.Sys_User.updateMany({
    data: updateBody,
    where: {
      userid,
    },
  });
  return user;
};

/**
 * Update user by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const user = await getUserByUserId(cGuid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, updateBody);
  await prisma.Sys_User.updateMany({
    data: updateBody,
    where: {
      cGuid,
    },
  });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} cGuid
 * @returns {Promise<User>}
 */
const deleteUserById = async (cGuid) => {
  const user = await getUserById(cGuid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await prisma.Sys_User.delete({
    where: { cGuid },
  });

  return user;
};

module.exports = {
  getall,
  pagination,
  getUserById,
  getUserByUserId,
  getUserByEmail,
  updatebyuserid,
  updatebyid,
  deleteUserById,
};
