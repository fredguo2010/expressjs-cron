const prisma = require('../../core/prisma');
const { sysuserService } = require('..');
const treeNode = require('../../utils/treeNode');

const select = {
  cGuid: true,
  cName: true,
  cPositionCode: true,
  cParentGuid: true,
  cParentName: true,
  cHead: true,
  cHeadUserId: true,
  iStatus: true,
  dCreateTime: true,
  cCreateUserId: true,
  cCreateUserName: true,
  dModifyTime: true,
  cModifyUserId: true,
  cModifyUserName: true,
  EMS_Meter: true,
};

/**
 * ems position get all
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.EMS_Position.findMany();
};

/**
 * pagination for ems position
 *
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

  const count = await prisma.EMS_Position.count({ where: filter });
  const emsPosition = await prisma.EMS_Position.findMany({
    where: filter,
    select,
    skip: (page - 1) * row,
    take: row,
    orderBy: {
      cPositionCode: 'asc',
    },
  });
  return { isok: true, total: count, data: emsPosition };
};

/**
 * Get ems position by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const getById = async (cGuid) => {
  return prisma.EMS_Position.findUnique({
    select,
    where: {
      cGuid,
    },
  });
};

/**
 * Get ems position tree data
 * @returns {Promise<any>}
 */
const getTreeNodes = async () => {
  const data = await prisma.EMS_Position.findMany({
    orderBy: {
      cPositionCode: 'asc',
    },
  });

  const treeOption = {
    enable: true, // Whether to enable the tree plugin
    keyField: 'key', // Name of the field to use as the node's identifier
    valueField: 'value', // Name of the field to use as the node's value
    titleField: 'title', // Name of the field to use as the node's title

    keyFieldBind: 'cGuid', // Name of the field to bind to the node's identifier
    valueFieldBind: 'cGuid', // Name of the field to bind to the node's value
    titleFieldBind: 'cName', // Name of the field to bind to the node's title
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

  return { treeData };
};

/**
 * Create ems position
 * @param {Object} createBody
 * @returns {Promise<any>}
 */
const add = async (createBody) => {
  const sysUser = await sysuserService.getUserByUserId(createBody.cCreateUserId);

  let tobeCreated = Object.assign(createBody, {
    cCreateUserId: sysUser.userid,
    dCreateTime: new Date(),
  });

  if (createBody.cParentGuid) {
    const parent = await getById(createBody.cParentGuid);
    if (parent) {
      tobeCreated = Object.assign(tobeCreated, {
        cParentName: parent.cName,
      });
    }
  }

  if (createBody.cHeadUserId) {
    // eslint-disable-next-line no-shadow
    const sysUser = await sysuserService.getUserByUserId(createBody.cHeadUserId);
    if (sysUser)
      tobeCreated = Object.assign(tobeCreated, {
        cHead: sysUser.lastname === '' ? sysUser.username : `${sysUser.lastname}${sysUser.firstname}`,
      });
  }

  const emsPosition = await prisma.EMS_Position.create({
    data: tobeCreated,
  });
  return { isok: true, data: emsPosition, message: 'success' };
};

/**
 * Update ems position by Id
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<any>}
 */
const updateById = async (cGuid, updateBody) => {
  const position = await getById(cGuid);
  if (!position) {
    return { isok: false, data: null, message: '没有找到位置信息' };
  }

  const sysUser = await sysuserService.getUserByUserId(updateBody.cModifyUserId);
  let tobeUpdated = Object.assign(updateBody, {
    cModifyUserId: sysUser.userid,
    cModifyUserName: sysUser.username,
    dModifyTime: new Date(),
  });

  if (updateBody.cParentGuid) {
    const parent = await getById(updateBody.cParentGuid);
    if (parent) {
      tobeUpdated = Object.assign(tobeUpdated, {
        cParentName: parent.cName,
      });
    }
  }

  if (updateBody.cHeadUserId) {
    const sysUserHead = await sysuserService.getUserByUserId(updateBody.cHeadUserId);
    if (sysUserHead)
      tobeUpdated = Object.assign(tobeUpdated, {
        cHead: sysUserHead.lastname === '' ? sysUserHead.username : `${sysUserHead.lastname}${sysUserHead.firstname}`,
      });
  }

  await prisma.EMS_Position.updateMany({
    data: tobeUpdated,
    where: {
      cGuid,
    },
  });
  return { isok: true, data: tobeUpdated, message: 'success' };
};

/**
 * Delete ems position by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const deleteById = async (cGuid) => {
  const position = await getById(cGuid);
  if (!position) {
    return { isok: false, data: null, message: '没有找到位置信息' };
  }

  try {
    const data = await prisma.EMS_Position.delete({
      where: { cGuid },
    });
    return { isok: true, data, message: 'success' };
  } catch (error) {
    return { isok: false, data: null, message: '当前介质已被使用,无法删除' };
  }
};

const getTagTreeNodes = async () => {
  const eccd = 'ECCD';
  const emsPositions = await prisma.EMS_Position.findMany({
    select: {
      cGuid: true,
      cName: true,
      cPositionCode: true,
      cParentGuid: true,
      cParentName: true,
      cHead: true,
      cHeadUserId: true,
      dCreateTime: true,
      cCreateUserId: true,
      cCreateUserName: true,
      dModifyTime: true,
      cModifyUserId: true,
      cModifyUserName: true,
      EMS_Meter: {
        select: {
          cGuid: true,
          cName: true,
          EMS_Tag: {
            select: {
              cTagId: true,
              cName: true,
              cFriendlyName: true,
            },
            where: {
              cName: {
                contains: eccd,
              },
            },
          },
        },
      },
    },
  });
  if (emsPositions.length > 0) {
    let defaultTagId = '';
    let defaultTagName = '';
    const initTreeData = emsPositions.flatMap((element) => {
      return [
        {
          cGuid: element.cGuid,
          cName: element.cName,
          cParentGuid: element.cParentGuid,
        },
        ...element.EMS_Meter.flatMap((meter) => {
          return [
            {
              cGuid: meter.cGuid,
              cName: meter.cName,
              cParentGuid: element.cGuid,
            },
            ...meter.EMS_Tag.flatMap((tag) => {
              if (defaultTagId === '') {
                defaultTagId = tag.cTagId;
                defaultTagName = tag.cFriendlyName !== `` && tag.cFriendlyName !== undefined ? tag.cFriendlyName : tag.cName;
              }
              return [
                {
                  cGuid: tag.cTagId,
                  cName: tag.cFriendlyName !== `` && tag.cFriendlyName !== undefined ? tag.cFriendlyName : tag.cName,
                  cParentGuid: meter.cGuid,
                },
              ];
            }),
          ];
        }),
      ];
    });
    const treeOption = {
      enable: true, // Whether to enable the tree plugin
      keyField: 'key', // Name of the field to use as the node's identifier
      valueField: 'value', // Name of the field to use as the node's value
      titleField: 'title', // Name of the field to use as the node's title

      keyFieldBind: 'cGuid', // Name of the field to bind to the node's identifier
      valueFieldBind: 'cGuid', // Name of the field to bind to the node's value
      titleFieldBind: 'cName', // Name of the field to bind to the node's title
    };

    // Convert the data to a tree structure using the configured options
    const treeData = treeNode.toTreeByRecursion(
      initTreeData,
      'cGuid', // The name of the field used as the node's identifier
      'cParentGuid', // The name of the field used as the node's parent identifier
      null, // The value of the root node's parent identifier
      'children', // The name of the field used to store child nodes
      treeOption // The configuration options for the tree plugin
    );
    return { isok: true, msg: 'success', data: { treeData, default: { defaultTagId, defaultTagName } } };
  }
  return { isok: true, msg: 'success', data: {} };
};

module.exports = {
  getall,
  pagination,
  getById,
  getTreeNodes,
  add,
  updateById,
  deleteById,
  getTagTreeNodes,
};
