const httpStatus = require('http-status');
const uuidv4 = require('uuid').v4;
const ApiError = require('../../utils/ApiError');
const prisma = require('../../core/prisma');
const treeNode = require('../../utils/treeNode');

/**
 * sysRoleMenu get all
 * @param {Object} SysRoleMenuBody
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.Sys_RoleMenu.findMany();
};

/**
 * pagination for sysRoleMenus
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

  const sysRoleMenus = await prisma.Sys_RoleMenu.findMany({
    where: filter,
    skip: (page - 1) * row,
    take: row,
    orderBy: orderByObj,
  });
  return sysRoleMenus;
};

/**
 * Get sysRoleMenu by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysRoleMenu>}
 */
const getsysRoleMenuById = async (cGuid) => {
  return prisma.Sys_RoleMenu.findUnique({
    where: {
      cGuid,
    },
  });
};

/**
 * getallauthmenutreenodesbyrolename
 * @param {string} cRoleName
 * @returns {Promise<MenuData>}
 */
const getallauthmenutreenodesbyrolename = async (cRole) => {
  const rowdata = await prisma.Sys_Role.findFirst({
    where: { cRoleName: cRole },
  });
  if (rowdata != null) {
    const findRoleMenu = {
      OR: [
        {
          AND: { cRoleGuid: rowdata.cGuid, bSelect: true },
        },
        {
          AND: { cRoleGuid: rowdata.cGuid, cParentGuid: null, bSelect: true },
        },
      ],
    };
    const data = await prisma.Sys_RoleMenu.findMany({
      where: findRoleMenu,
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
    const treeData = treeNode.toTreeByRecursion(data, 'cMenuGuid', 'cParentGuid', null, 'children', treeOption);

    const MenuData = {
      text: '',
      i18n: 'menu.main',
      group: true,
      hideInBreadcrumb: true,
      children: treeData,
    };
    return MenuData;
  }
};

/**
 * getmenutreenodesbyroleguid
 * @param {string} cGuid
 * @returns {Promise<MenuData>}
 */
const getmenutreenodesbyroleguid = async (cRole) => {
  const rowdata = await prisma.Sys_Role.findFirst({
    where: { cGuid: cRole },
  });
  if (rowdata != null) {
    const findRoleMenu = {
      OR: [
        {
          AND: { cRoleGuid: rowdata.cGuid },
        },
        {
          AND: { cRoleGuid: rowdata.cGuid, cParentGuid: null },
        },
      ],
    };
    const data = await prisma.Sys_RoleMenu.findMany({
      where: findRoleMenu,
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
    const treeData = treeNode.toTreeByRecursion(data, 'cMenuGuid', 'cParentGuid', null, 'children', treeOption);

    return treeData;
  }
};

/**
 * getabilitybyrolename
 * @param {string} cRoleName
 * @returns {Promise<ability>}
 */
const getabilitybyrolename = async (cRoleName) => {
  const rowdata = await prisma.Sys_Role.findFirst({
    where: {
      cRoleName,
    },
  });
  if (rowdata != null) {
    const data = await prisma.Sys_RoleMenu.findMany({
      where: {
        AND: {
          cRoleGuid: rowdata.cGuid,
          bSelect: true,
          ability: {
            not: null,
          },
        },
      },
      select: {
        ability: true,
      },
    });
    const ability = data.map((item) => item.ability);
    return ability;
  }
};

/**
 * Create sysRoleMenu with createBody
 * @param {Object} createBody
 * @returns {Promise<sysRoleMenu>}
 */
const addsysRoleMenu = async (createBody) => {
  const sysRoleMenu = await prisma.Sys_RoleMenu.create({
    data: createBody,
  });
  return sysRoleMenu;
};

/**
 * Update sysRoleMenu by cGuid
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<sysRoleMenu>}
 */
const updatebyid = async (cGuid, updateBody) => {
  const sysRoleMenu = await getsysRoleMenuById(cGuid);
  if (!sysRoleMenu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysRoleMenu not found');
  }

  await prisma.Sys_RoleMenu.updateMany({
    data: updateBody,
    where: {
      cGuid,
    },
  });

  const existbSelect = await prisma.Sys_RoleMenu.count({
    where: {
      AND: {
        cRoleGuid: sysRoleMenu.cRoleGuid,
        cParentGuid: sysRoleMenu.cParentGuid,
        bSelect: true,
      },
    },
  });
  if (existbSelect > 0) {
    await prisma.Sys_RoleMenu.updateMany({
      data: {
        bSelect: true,
      },
      where: {
        AND: {
          cRoleGuid: sysRoleMenu.cRoleGuid,
          cMenuGuid: sysRoleMenu.cParentGuid,
          bSelect: false,
        },
      },
    });
  } else {
    await prisma.Sys_RoleMenu.updateMany({
      data: {
        bSelect: false,
      },
      where: {
        AND: {
          cRoleGuid: sysRoleMenu.cRoleGuid,
          cMenuGuid: sysRoleMenu.cParentGuid,
          bSelect: true,
        },
      },
    });
  }
  return sysRoleMenu;
};

/**
 * Delete sysRoleMenu by id
 * @param {ObjectId} cGuid
 * @returns {Promise<sysRoleMenu>}
 */
const deletesysRoleMenuById = async (cGuid) => {
  const sysRoleMenu = await getsysRoleMenuById(cGuid);
  if (!sysRoleMenu) {
    throw new ApiError(httpStatus.NOT_FOUND, 'sysRoleMenu not found');
  }

  await prisma.Sys_RoleMenu.delete({
    where: { cGuid },
  });

  return sysRoleMenu;
};

/**
 * sync sysmenu by role guid
 * @param {ObjectId} cRoleGuid
 * @returns {Promise<sysRoleMenu>}
 */
const syncsysmenubyrole = async (cRoleGuid) => {
  if (!cRoleGuid) {
    throw new ApiError(httpStatus.NOT_FOUND, 'cRoleGuid require');
  }

  const rstMenus = await prisma.Sys_Menu.findMany();
  const rstRoleMenus = await prisma.Sys_RoleMenu.findMany({
    where: { cRoleGuid },
  });
  const updateCmd = [];
  const insertCmd = [];

  rstMenus.forEach((itemMenu) => {
    const rolemenurecrod = rstRoleMenus.find((item) => item.cMenuGuid === itemMenu.cGuid);

    if (rolemenurecrod !== undefined) {
      updateCmd.push(
        prisma.Sys_RoleMenu.update({
          where: {
            cGuid: rolemenurecrod.cGuid,
          },
          data: {
            text: itemMenu.text,
            link: itemMenu.link,
            i18n: itemMenu.i18n,
            ability: itemMenu.ability,
            icon: itemMenu.icon,
            memo: itemMenu.memo,
            status: itemMenu.status,
            sort: itemMenu.sort,
            cParentGuid: itemMenu.cParentGuid,
          },
        })
      );
    } else {
      insertCmd.push(
        prisma.Sys_RoleMenu.create({
          data: {
            cGuid: uuidv4().toLowerCase(),
            cMenuGuid: itemMenu.cGuid,
            cRoleGuid,
            bSelect: false,
            text: itemMenu.text,
            link: itemMenu.link,
            i18n: itemMenu.i18n,
            ability: itemMenu.ability,
            icon: itemMenu.icon,
            memo: itemMenu.memo,
            status: itemMenu.status,
            sort: itemMenu.sort,
            cParentGuid: itemMenu.cParentGuid,
            dAddTime: new Date(),
          },
        })
      );
    }
  });

  if (updateCmd.length > 0) {
    await prisma.$transaction(updateCmd);
  }

  if (insertCmd.length > 0) {
    await prisma.$transaction(insertCmd);
  }

  return true;
};

module.exports = {
  getall,
  pagination,
  getsysRoleMenuById,
  getallauthmenutreenodesbyrolename,
  getmenutreenodesbyroleguid,
  getabilitybyrolename,
  addsysRoleMenu,
  updatebyid,
  deletesysRoleMenuById,
  syncsysmenubyrole,
};
