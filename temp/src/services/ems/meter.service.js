const prisma = require('../../core/prisma');
const treeNode = require('../../utils/treeNode');
const { sysuserService } = require('..');

const select = {
  cGuid: true,
  cName: true,
  cModel: true,
  cManufacturer: true,
  cPositionFk: true,
  cSubsituteFk: true,
  cSubItemFk: true,
  cReturnZero: true,
  dCreateTime: true,
  cCreateUserId: true,
  cCreateUserName: true,
  dModifyTime: true,
  cModifyUserId: true,
  cModifyUserName: true,
  EMS_Position: true,
  EMS_SubItem: true,
  EMS_Subsitute: true,
  EMS_Tag: true,
};

/**
 * ems meter get all
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.EMS_Meter.findMany();
};

/**
 * pagination for ems meter
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

  const count = await prisma.EMS_Meter.count({ where: filter });
  const emsMeter = await prisma.EMS_Meter.findMany({
    where: filter,
    select,
    skip: (page - 1) * row,
    take: row,
    orderBy: [
      {
        EMS_Position: {
          cName: 'asc',
        },
      },
      { cName: 'asc' },
    ],
  });
  return { isok: true, total: count, data: emsMeter };
};

/**
 * Get cloud tag by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const getEmsMeterById = async (cGuid) => {
  return prisma.EMS_Meter.findUnique({
    select,
    where: {
      cGuid,
    },
  });
};

/**
 * Create ems meter
 * @param {Object} createBody
 * @returns {Promise<any>}
 */
const addEmsMeter = async (createBody) => {
  const sysUser = await sysuserService.getUserByUserId(createBody.cCreateUserId);

  const tobeCreated = Object.assign(createBody, {
    cCreateUserId: sysUser.userid,
    cCreateUserName: sysUser.username,
    dCreateTime: new Date(),
  });
  const emsMeter = await prisma.EMS_Meter.create({
    data: tobeCreated,
  });
  return { isok: true, data: emsMeter, message: 'success' };
};

/**
 * Update ems meter by Id
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<any>}
 */
const updateById = async (cGuid, updateBody) => {
  const meterId = await getEmsMeterById(cGuid);
  if (!meterId) {
    return { isok: false, data: null, message: '没有找到标签信息' };
  }
  const sysUser = await sysuserService.getUserByUserId(updateBody.cModifyUserId);
  const tobeUpdated = Object.assign(updateBody, {
    cModifyUserId: sysUser.userid,
    cModifyUserName: sysUser.username,
    dModifyTime: new Date(),
  });
  await prisma.EMS_Meter.updateMany({
    data: tobeUpdated,
    where: {
      cGuid,
    },
  });
  return { isok: true, data: tobeUpdated, message: 'success' };
};

/**
 * Delete ems meter by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const deleteById = async (cGuid) => {
  const meter = await getEmsMeterById(cGuid);
  if (!meter) {
    return { isok: false, data: null, message: '没有找到仪表信息' };
  }

  try {
    const data = await prisma.EMS_Meter.delete({
      where: { cGuid },
    });
    return { isok: true, data, message: 'success' };
  } catch (error) {
    return { isok: false, data: null, message: '当前仪表已被使用,无法删除' };
  }
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

  const dataMeter = await prisma.EMS_Meter.findMany({
    select,
    orderBy: [
      {
        cPositionFk: 'asc',
      },
      {
        cName: 'asc',
      },
    ],
  });
  const transformedMeterData = dataMeter.map((rst) => ({
    cGuid: rst.cGuid,
    cName: rst.cName,
    cPositionCode: rst.cName,
    cParentGuid: rst.EMS_Position.cGuid,
    cParentName: rst.EMS_Position.cName,
  }));

  const combinedData = [...data, ...transformedMeterData];

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
    combinedData,
    'cGuid', // The name of the field used as the node's identifier
    'cParentGuid', // The name of the field used as the node's parent identifier
    null, // The value of the root node's parent identifier
    'children', // The name of the field used to store child nodes
    treeOption // The configuration options for the tree plugin
  );

  return { treeData };
};

/**
 * Get ems position tree data with eccd tags
 * @returns {Promise<any>}
 */
const getTreeNodesWithEccdTags = async () => {
  const data = await prisma.EMS_Position.findMany({
    orderBy: {
      cPositionCode: 'asc',
    },
  });

  const dataMeter = await prisma.EMS_Meter.findMany({
    select,
    orderBy: [
      {
        cPositionFk: 'asc',
      },
      {
        cName: 'asc',
      },
    ],
  });
  const transformedMeterData = dataMeter.map((rst) => ({
    cGuid: rst.cGuid,
    cName: rst.cName,
    cPositionCode: rst.cName,
    cParentGuid: rst.EMS_Position.cGuid,
    cParentName: rst.EMS_Position.cName,
  }));

  const dataMeterTags = await prisma.EMS_Tag.findMany({
    select: {
      cGuid: true,
      cTagId: true,
      iStatus: true,
      cName: true,
      cFriendlyName: true,
      cHubName: true,
      cTagType: true,
      cDeviceAddress: true,
      cDeviceName: true,
      cDeviceId: true,
      cTagAddress: true,
      cTagMemAddress: true,
      cMeterFk: true,
      cUnitFk: true,
      dCreateTime: true,
      cCreateUserId: true,
      cCreateUserName: true,
      dModifyTime: true,
      cModifyUserId: true,
      cModifyUserName: true,
      EMS_Meter: true,
    },
    where: {
      cName: {
        endsWith: '_ECCD',
      },
    },
    orderBy: [
      {
        cName: 'asc',
      },
      {
        cFriendlyName: 'asc',
      },
    ],
  });
  const transformedMeterTgasData = dataMeterTags.map((rst) => ({
    cGuid: rst.cGuid,
    cName: rst.cFriendlyName && rst.cFriendlyName !== '' ? rst.cFriendlyName : rst.cName,
    cPositionCode: rst.cName,
    cParentGuid: rst.EMS_Meter.cGuid,
    cParentName: rst.EMS_Meter.cName,
  }));

  const combinedData = [...data, ...transformedMeterData, ...transformedMeterTgasData];

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
    combinedData,
    'cGuid', // The name of the field used as the node's identifier
    'cParentGuid', // The name of the field used as the node's parent identifier
    null, // The value of the root node's parent identifier
    'children', // The name of the field used to store child nodes
    treeOption // The configuration options for the tree plugin
  );

  return { treeData };
};

/**
 * Get ems position tree data with all tags
 * @returns {Promise<any>}
 */
const getTreeNodesWithTags = async () => {
  const data = await prisma.EMS_Position.findMany({
    orderBy: {
      cPositionCode: 'asc',
    },
  });

  const dataMeter = await prisma.EMS_Meter.findMany({
    select,
    orderBy: [
      {
        cPositionFk: 'asc',
      },
      {
        cName: 'asc',
      },
    ],
  });
  const transformedMeterData = dataMeter.map((rst) => ({
    cGuid: rst.cGuid,
    cName: rst.cName,
    cPositionCode: rst.cName,
    cParentGuid: rst.EMS_Position.cGuid,
    cParentName: rst.EMS_Position.cName,
  }));

  const dataMeterTags = await prisma.EMS_Tag.findMany({
    select: {
      cGuid: true,
      cTagId: true,
      iStatus: true,
      cName: true,
      cFriendlyName: true,
      cHubName: true,
      cTagType: true,
      cDeviceAddress: true,
      cDeviceName: true,
      cDeviceId: true,
      cTagAddress: true,
      cTagMemAddress: true,
      cMeterFk: true,
      cUnitFk: true,
      dCreateTime: true,
      cCreateUserId: true,
      cCreateUserName: true,
      dModifyTime: true,
      cModifyUserId: true,
      cModifyUserName: true,
      EMS_Meter: true,
    },
    orderBy: [
      {
        cName: 'asc',
      },
      {
        cFriendlyName: 'asc',
      },
    ],
  });
  const transformedMeterTgasData = dataMeterTags.map((rst) => ({
    cGuid: rst.cGuid,
    cName: rst.cFriendlyName && rst.cFriendlyName !== '' ? rst.cFriendlyName : rst.cName,
    cPositionCode: rst.cName,
    cParentGuid: rst.EMS_Meter.cGuid,
    cParentName: rst.EMS_Meter.cName,
  }));

  const combinedData = [...data, ...transformedMeterData, ...transformedMeterTgasData];

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
    combinedData,
    'cGuid', // The name of the field used as the node's identifier
    'cParentGuid', // The name of the field used as the node's parent identifier
    null, // The value of the root node's parent identifier
    'children', // The name of the field used to store child nodes
    treeOption // The configuration options for the tree plugin
  );

  return { treeData };
};

module.exports = {
  getall,
  pagination,
  getEmsMeterById,
  addEmsMeter,
  updateById,
  deleteById,
  getTreeNodes,
  getTreeNodesWithEccdTags,
  getTreeNodesWithTags,
};
