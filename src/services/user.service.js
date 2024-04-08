const httpStatus = require('http-status');
const uuidv4 = require('uuid').v4;
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const tokenService = require('./token.service');
const { tokenTypes } = require('../config/tokens');
const prisma = require('../core/prisma');

/**
 * Get user by userid
 * @param {ObjectId} userid
 * @returns {Promise<User>}
 */
const getUserByUserId = async (userid) => {
  return prisma.Sys_User.findFirst({
    where: {
      userid,
    },
  });
};

/**
 * Get user by cGuid
 * @param {ObjectId} cGuid
 * @returns {Promise<User>}
 */
const getUserById = async (cGuid) => {
  return prisma.Sys_User.findFirst({
    where: {
      cGuid,
    },
  });
};

/**
 * Get user by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const getUserByUsername = async (username) => {
  return prisma.Sys_User.findFirst({
    where: {
      username,
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
 * authenticate
 * @param {object} loginBody
 * @returns {Promise<authdata>}
 */
const authenticate = async (loginBody) => {
  const { username, password } = loginBody;

  try {
    const user = await prisma.Sys_User.findFirst({
      where: {
        username,
      },
    }).catch((e) => {
      throw new ApiError(httpStatus.BAD_REQUEST, `User Not Found${e}`);
    });
    if (!user) {
      return { isok: false, message: 'User Not Found' };
    }
    const hash256 = crypto.createHash('sha256');
    const pwdsha256 = await hash256.update(password + user.salt.toLowerCase(), 'utf8').digest('base64');
    const passwordsMatch = pwdsha256 === user.passwordHash;

    if (passwordsMatch) {
      return {
        isok: true,
        user,
      };
    }
    return { isok: false, message: 'Incorrect Password' };
  } catch (error) {
    return { isok: false, message: error };
  }
};

/**
 * authenticate
 * @param {object} loginBody
 * @returns {Promise<authdata>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await getUserByUserId(refreshTokenDoc.userid);

    if (user && refreshTokenDoc) {
      await prisma.Sys_Token.delete({
        where: {
          cGuid: refreshTokenDoc.cGuid,
        },
      });
    }
    const tokens = await tokenService.generateAuthTokens(user);
    return { isok: true, user, tokens };
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, `refreshAuth, error:${error.message}`);
  }
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const userExists = await prisma.Sys_User.findFirst({
    where: {
      email: userBody.email,
    },
  });
  if (userExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.Sys_User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const page = Number(options.page) || 1;
  const row = Number(options.row) || 5;

  const users = await prisma.Sys_User.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
  });
  return users;
};

/**
 * Update user by id
 * @param {ObjectId} userid
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByUserId = async (userid, updateBody) => {
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
 * Update user by id
 * @param {ObjectId} userid
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const resetrandompwd = async (userid) => {
  const user = await prisma.Sys_User.findFirst({ where: { userid } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const hash256 = crypto.createHash('sha256');
  const randompwd = crypto.randomBytes(6).toString('hex');

  const passwordHash = await hash256.update(`${randompwd}${user.salt.toLowerCase()}`, 'utf8').digest('base64');
  user.password = passwordHash;
  await prisma.Sys_User.update({
    where: {
      cGuid: user.cGuid,
    },
    data: {
      passwordHash: user.password,
    },
  });
  return { isok: true, message: `新密码：${randompwd}` };
};

/**
 * Update user pwd
 * @param {ObjectId} userid
 * @param {Object} newpwd
 * @param {Object} orgpwd
 * @returns {Promise<User>}
 */
const updatepwd = async (userid, newpwd, orgpwd) => {
  try {
    const user = await prisma.Sys_User.findFirst({
      where: {
        userid,
      },
    }).catch((e) => {
      throw new ApiError(httpStatus.BAD_REQUEST, `User Not Found${e}`);
    });
    if (!user) {
      return { isok: false, message: 'User does not exist' };
    }
    const hash256 = crypto.createHash('sha256');
    const pwdsha256 = await hash256.update(orgpwd + user.salt.toLowerCase(), 'utf8').digest('base64');
    const passwordsMatch = pwdsha256 === user.passwordHash;

    if (passwordsMatch) {
      const newhash256 = crypto.createHash('sha256');
      const passwordHash = await newhash256.update(`${newpwd}${user.salt.toLowerCase()}`, 'utf8').digest('base64');
      user.password = passwordHash;
      await prisma.Sys_User.update({
        where: {
          cGuid: user.cGuid,
        },
        data: {
          passwordHash: user.password,
        },
      });
      return {
        isok: true,
        user,
        message: '更新成功',
      };
    }
    return { isok: false, message: 'Incorrect password' };
  } catch (error) {
    return { isok: false, message: error.message };
  }
};

/**
 * Update user by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (cGuid, updateBody) => {
  const user = await getUserById(cGuid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const userExist = await prisma.Sys_User.findFirst({
    where: {
      email: updateBody.email,
      userid: {
        not: user.userid,
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
      cGuid,
    },
  });
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userid
 * @returns {Promise<User>}
 */
const deleteUserById = async (userid) => {
  const user = await getUserByUserId(userid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Check user is exist by username
 * @param {string} username
 * @returns {Promise<User>}
 */
const checkUserExistByUsername = async (username) => {
  const user = await getUserByUsername(username);
  return user != null;
};

/**
 * User register
 *
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {string} phone
 */
const userRegister = async (username, password, email, phone) => {
  const userexist = await prisma.Sys_User.findFirst({
    where: {
      username,
    },
  }).catch((e) => {
    return { isok: true, data: null, message: e.message };
  });

  if (userexist) {
    // throw new ApiError(httpStatus.IM_USED, 'User exists');
    return { isok: false, data: null, message: 'User exists' };
  }
  const csalt = uuidv4().toLowerCase();
  const hash256 = crypto.createHash('sha256');
  hash256.update(password + csalt, 'utf8');
  const passwordHash = hash256.digest('base64');
  const createUsered = await prisma.Sys_User.create({
    data: {
      cGuid: uuidv4(),
      userid: uuidv4(),
      username,
      passwordHash,
      salt: csalt,
      email,
      phone,
      role: 'user',
    },
  });
  return { isok: true, data: createUsered, message: 'success' };
};

module.exports = {
  authenticate,
  refreshAuth,
  createUser,
  queryUsers,
  getUserByUserId,
  getUserByEmail,
  resetrandompwd,
  updatepwd,
  updateUserByUserId,
  updateUserById,
  deleteUserById,
  checkUserExistByUsername,
  userRegister,
};
