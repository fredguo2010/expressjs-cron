const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');
const treeNode = require('../../utils/treeNode');
const { sysuserService } = require('..');

/**
 * sysOrg get all
 * @param {Object} SysOrgBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_Org.findMany();
};

/**
 * pagination for sysOrgs
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
      cOrgCode: 'asc',
    };
  }

  const count = await prisma.Sys_Org.count({
    where: filter,
  });

  const sysOrgs = await prisma.Sys_Org.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return { isok: true, total: count, data: sysOrgs };
};

/**
 * Get sysOrg by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysOrg>}
 */
const getsysOrgById = async (cGuid) => {
  return prisma.Sys_Org.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Get sysOrg treeData
 * @returns {Promise<treeData>}
 */
const gettreenodes = async () => {
  const data = await prisma.Sys_Org.findMany({
    orderBy: {
      cOrgCode: 'asc',
    },
  });

  const treeOption = {
    enable: true, // Whether to enable the tree plugin
    keyField: 'key', // Name of the field to use as the node's identifier
    valueField: 'value', // Name of the field to use as the node's value
    titleField: 'title', // Name of the field to use as the node's title

    keyFieldBind: 'cGuid', // Name of the field to bind to the node's identifier
    valueFieldBind: 'cGuid', // Name of the field to bind to the node's value
    titleFieldBind: 'cOrgName', // Name of the field to bind to the node's title
  };

  // Convert the data to a tree structure using the configured options
  const treeData = treeNode.toTreeByRecursion(
    data,
    'cGuid', // The name of the field used as the node's identifier
    'cParentGuid', // The name of the field used as the node's parent identifier
    null, // The value of the root node's parent identifier
    'children', // The name of the field used to store child nodes
    treeOption // The configuration options for the tree plugin
  );

  // const MenuData = {
  //   text: '',
  //   i18n: 'menu.main',
  //   group: true,
  //   hideInBreadcrumb: true,
  //   children: treeData,
  // };
  return { treeData };
};

/**
 * Create sysOrg with createBody
 * @param {Object} createBody
 * @returns {Promise<sysOrg>}
 */
const addsysOrg = async (createBody) => {
  let tobeAddBody;
  if (createBody.cParentGuid && createBody.cParentGuid !== '') {
    const sysOrgParent = await getsysOrgById(createBody.cParentGuid);
    tobeAddBody = Object.assign(createBody, {
      cParentOrgCode: sysOrgParent.cOrgCode,
      cParentOrgName: sysOrgParent.cOrgName,
    });
  } else {
    tobeAddBody = Object.assign(createBody, {
      cParentGuid: null,
      cParentOrgCode: '',
      cParentOrgName: '',
    });
  }
  const sysOrg = await prisma.Sys_Org.create({
    data: tobeAddBody,
  });
  return { isok: true, data: sysOrg };
};

/**
 * Update sysOrg by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysOrg>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysOrg = await getsysOrgById(cGuid);
  if (!sysOrg) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysOrg not found');
  }

  let tobeUpdateBody;
  if (updateBody.cParentGuid && updateBody.cParentGuid !== '') {
    const sysOrgParent = await getsysOrgById(updateBody.cParentGuid);
    tobeUpdateBody = Object.assign(updateBody, {
      cParentOrgCode: sysOrgParent.cOrgCode,
      cParentOrgName: sysOrgParent.cOrgName,
    });
  } else {
    tobeUpdateBody = Object.assign(updateBody, {
      cParentGuid: null,
      cParentOrgCode: '',
      cParentOrgName: '',
    });
  }
  if (updateBody.cHeadUserGuid) {
    const sysUser = await sysuserService.getUserById(updateBody.cHeadUserGuid);
    if (sysUser)
      tobeUpdateBody = Object.assign(tobeUpdateBody, {
        cHead: sysUser.lastname === '' ? sysUser.username : `${sysUser.lastname}${sysUser.firstname}`,
      });
  }

  await prisma.Sys_Org.updateMany({
    data: tobeUpdateBody,
    where: {
      cGuid,
    },
  });
  return { isok: true, data: sysOrg };
};

/**
 * Delete sysOrg by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysOrg>}
 */
const deletesysOrgById = async (cGuid) => {
  const sysOrg = await getsysOrgById(cGuid);
  if (!sysOrg) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysOrg not found');
  }

  await prisma.Sys_Org.delete({
    where: { cGuid },
  });

  return sysOrg;
};

module.exports = {
  getall,
  pagination,
  getsysOrgById,
  gettreenodes,
  addsysOrg,
  updatebyid,
  deletesysOrgById,
};
