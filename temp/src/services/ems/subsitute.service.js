const prisma = require('../../core/prisma');
const { sysuserService } = require('..');

const select = {
  cGuid: true,
  cName: true,
  dCreateTime: true,
  cCreateUserId: true,
  cCreateUserName: true,
  dModifyTime: true,
  cModifyUserId: true,
  cModifyUserName: true,
  cCoverPictureName: true,
  cCoverPicturePath: true,
  EMS_Meter: true,
};

/**
 * ems subsitute get all
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.EMS_Subsitute.findMany({});
};

/**
 * pagination for ems subsitute
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

  const count = await prisma.EMS_Subsitute.count({ where: filter });
  const emsSubsitute = await prisma.EMS_Subsitute.findMany({
    where: filter,
    select,
    skip: (page - 1) * row,
    take: row,
    orderBy: {
      dCreateTime: 'desc',
    },
  });
  return { isok: true, total: count, data: emsSubsitute };
};

/**
 * Get ems subsitute by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const getEmsSubsituteById = async (cGuid) => {
  return prisma.EMS_Subsitute.findUnique({
    select,
    where: {
      cGuid,
    },
  });
};

/**
 * Create ems subsitute
 * @param {Object} createBody
 * @returns {Promise<any>}
 */
const addEmsSubsitute = async (createBody) => {
  const sysUser = await sysuserService.getUserByUserId(createBody.cCreateUserId);

  const tobeCreated = Object.assign(createBody, {
    cCreateUserId: sysUser.userid,
    cCreateUserName: sysUser.username,
    dCreateTime: new Date(),
  });
  const emsSubsitute = await prisma.EMS_Subsitute.create({
    data: tobeCreated,
  });
  return { isok: true, data: emsSubsitute, message: 'success' };
};

/**
 * Update ems subsitute by Id
 * @param {ObjectId} cGuid
 * @param {Object} updateBody
 * @returns {Promise<any>}
 */
const updateById = async (cGuid, updateBody) => {
  const subsitute = await getEmsSubsituteById(cGuid);
  if (!subsitute) {
    return { isok: false, data: null, message: '没有找到标签信息' };
  }
  const sysUser = await sysuserService.getUserByUserId(updateBody.cModifyUserId);
  const tobeUpdated = Object.assign(updateBody, {
    cModifyUserId: sysUser.userid,
    cModifyUserName: sysUser.username,
    dModifyTime: new Date(),
  });
  await prisma.EMS_Subsitute.updateMany({
    data: tobeUpdated,
    where: {
      cGuid,
    },
  });
  return { isok: true, data: tobeUpdated, message: 'success' };
};

/**
 * Delete ems subsitute by id
 * @param {ObjectId} cGuid
 * @returns {Promise<emsSubsitute>}
 */
const deleteById = async (cGuid) => {
  const subsitute = await getEmsSubsituteById(cGuid);
  if (!subsitute) {
    return { isok: false, data: null, message: '没有找到介质信息' };
  }

  try {
    const data = await prisma.EMS_Subsitute.delete({
      where: { cGuid },
    });
    return { isok: true, data, message: 'success' };
  } catch (error) {
    return { isok: false, data: null, message: '当前介质已被使用,无法删除' };
  }
};

const getTreeNodes = async () => {
  const eccd = 'ECCD';
  const emsSubsitutes = await prisma.EMS_Subsitute.findMany({
    select: {
      cGuid: true,
      cName: true,
      dCreateTime: true,
      cCreateUserId: true,
      cCreateUserName: true,
      dModifyTime: true,
      cModifyUserId: true,
      cModifyUserName: true,
      cCoverPictureName: true,
      cCoverPicturePath: true,
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

  // 转换后的数据
  const treeData = emsSubsitutes.map((item) => {
    const children = item.EMS_Meter.map((meter) => {
      const tags = meter.EMS_Tag.map((tag) => ({
        title: tag.cFriendlyName !== `` && tag.cFriendlyName ? tag.cFriendlyName : tag.cName, // 替换成实际的属性
        key: tag.cTagId, // 替换成实际的属性
        isLeaf: true,
        isChecked: true,
      }));

      return {
        title: meter.cName,
        key: meter.cGuid,
        selectable: false,
        isLeaf: false,
        children: tags,
        expanded: true,
        isSelectable: false,
      };
    });

    return {
      title: item.cName,
      key: item.cGuid,
      expanded: true,
      selectable: false,
      isSelectable: false,
      children,
    };
  });
  const findTag = (data) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of data) {
      const foundMeter = item.children.find((meter) => meter.children.some((tag) => Boolean(tag.key)));
      if (foundMeter) {
        const foundTag = foundMeter.children.find((tag) => Boolean(tag.key));
        if (foundTag) {
          return { key: foundTag.key, name: foundTag.title };
        }
      }
    }
    return null;
  };

  const defaultTag = findTag(treeData);

  const defaultTagId = defaultTag ? defaultTag.key : '';
  const defaultTagName = defaultTag ? defaultTag.name : '';

  return {
    isok: true,
    data: { default: { defaultTagId, defaultTagName }, treeData },
    message: 'success',
  };
};

module.exports = {
  getall,
  pagination,
  getEmsSubsituteById,
  addEmsSubsitute,
  updateById,
  deleteById,
  getTreeNodes,
};
