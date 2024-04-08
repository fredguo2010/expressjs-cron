const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const treeNode = require('../../utils/treeNode');
const prisma = require('../../core/prisma');

/**
 * sysMenu get all
 * @param {Object} SysMenuBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_Menu.findMany();
};

/**
 * pagination for sysMenus
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.orderBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.row] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const pagination = async (filter, options) => {
  let page = Number(options.page) || 1;
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
      sort: 'asc',
    };
  }

  const count = await prisma.Sys_Menu.count({ where: filter });
  if (count < row) page = 1;

  const sysMenus = await prisma.Sys_Menu.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return { total: count, data: sysMenus };
};

/**
 * Get sysMenu by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysMenu>}
 */
const getsysMenuById = async (cGuid) => {
  return prisma.Sys_Menu.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * Get sysMenu by id
 * @returns {Promise<sysMenu>}
 */
const getsysMenuParents = async () => {
  // Define the filter criteria to get the root menu items
  const find = { cParentGuid: null };

  // Fetch all the menu items that match the given filter
  const data = await prisma.Sys_Menu.findMany({
    where: find,
    orderBy: {
      sort: 'asc',
    },
  });

  return data;
};

/**
 * Create sysMenu with createBody
 * @param {Object} createBody
 * @returns {Promise<sysMenu>}
 */
const addsysMenu = async (createBody) => {
  const tobeCreated = Object.assign(createBody, {
    dCreateTime: new Date(),
  });

  const sysMenu = await prisma.Sys_Menu.create({
    data: tobeCreated,
  });
  return sysMenu;
};

/**
 * Update sysMenu by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysMenu>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysMenu = await getsysMenuById(cGuid);
  if (!sysMenu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysMenu not found');
  }

  const tobeUpdated = Object.assign(updateBody, {
    dModifyTime: new Date(),
  });

  await prisma.Sys_Menu.update({
    data: tobeUpdated,
    where: {
      cGuid,
    },
  });

  await prisma.Sys_RoleMenu.updateMany({
    data: updateBody,
    where: {
      cMenuGuid: cGuid,
    },
  });

  return sysMenu;
};

/**
 * Delete sysMenu by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysMenu>}
 */
const deletesysMenuById = async (cGuid) => {
  const sysMenu = await getsysMenuById(cGuid);
  if (!sysMenu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysMenu not found');
  }

  await prisma.Sys_Menu.delete({
    where: { cGuid },
  });

  await prisma.Sys_RoleMenu.deleteMany({
    where: { cMenuGuid: cGuid },
  });

  return sysMenu;
};

/**
 * getmenutreenodes
 * @returns {Promise<MenuData>}
 */
const getmenutreenodes = async () => {
  const data = await prisma.Sys_Menu.findMany({
    orderBy: {
      sort: 'asc',
    },
  });

  const treeOption = {
    enable: true, // 是否开启转tree插件数据
    keyField: 'key', // 标识字段名称
    valueField: 'value', // 值字段名称
    titleField: 'title', // 标题字段名称

    keyFieldBind: 'cGuid', // 标识字段绑定字段名称
    valueFieldBind: 'cGuid', // 值字段名称绑定字段名称
    titleFieldBind: 'text', // 标题字段名称绑定字段名称
  };
  const treeData = treeNode.toTreeByRecursion(data, 'cGuid', 'cParentGuid', null, 'children', treeOption);

  // const MenuData = {
  //   text: '',
  //   i18n: 'menu.main',
  //   group: true,
  //   hideInBreadcrumb: true,
  //   children: treeData,
  // };
  return treeData;
};

module.exports = {
  getall,
  pagination,
  getsysMenuById,
  getmenutreenodes,
  getsysMenuParents,
  addsysMenu,
  updatebyid,
  deletesysMenuById,
};
