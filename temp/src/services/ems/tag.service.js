const axios = require('axios');
const prisma = require('../../core/prisma');
const config = require('../../config/config');
const { sysuserService } = require('..');

const select = {
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
};

/**
 * ems tag get all
 * @returns {Promise<QueryResult>}
 */
const getall = async () => {
  return prisma.EMS_Tag.findMany();
};

/**
 * pagination for ems tag
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

  const count = await prisma.EMS_Tag.count({ where: filter });
  const emsTag = await prisma.EMS_Tag.findMany({
    where: filter,
    select,
    skip: (page - 1) * row,
    take: row,
    orderBy: {
      dCreateTime: 'desc',
    },
  });
  return { isok: true, total: count, data: emsTag };
};

/**
 * Get ems tag by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const getById = async (cGuid) => {
  return prisma.EMS_Tag.findUnique({
    select,
    where: {
      cGuid,
    },
  });
};

/**
 * Get ems tag by device ids input as array of strings
 * @param {Array<string>} cDeviceIds
 * @returns {Promise<any>}
 */
const getByDeviceId = async (cDeviceIds) => {
  return prisma.EMS_Tag.findMany({
    select,
    where: {
      in: cDeviceIds,
    },
  });
};

/**
 * update ems tag by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const updateFriendlyNameById = async (cGuid, cFriendlyName) => {
  const tag = await getById(cGuid);
  if (!tag) {
    return { isok: false, data: null, message: '没有找到Tag信息' };
  }

  try {
    const data = await prisma.EMS_Tag.update({
      data: {
        cFriendlyName,
      },
      where: { cGuid },
    });
    return { isok: true, data, message: 'success' };
  } catch (error) {
    return { isok: false, data: null, message: '当前Tag已被使用,无法删除' };
  }
};

/**
 * Delete ems tag by id
 * @param {ObjectId} cGuid
 * @returns {Promise<any>}
 */
const deleteById = async (cGuid) => {
  const tag = await getById(cGuid);
  if (!tag) {
    return { isok: false, data: null, message: '没有找到Tag信息' };
  }

  try {
    const data = await prisma.EMS_Tag.delete({
      where: { cGuid },
    });
    return { isok: true, data, message: 'success' };
  } catch (error) {
    return { isok: false, data: null, message: '当前Tag已被使用,无法删除' };
  }
};

/**
 * Add or Update Tag with Meter
 * @param {string} cMeterGuid - meter GUID
 * @param {object} device - device object from RHUB
 * @param {Array<any>} tags - device tags as array of object from RHUB
 * @param {string} userId - user id
 * @returns {Promise<any>}
 */
const bindWithMeter = async (cMeterGuid, device, tags, userId) => {
  const sysUser = await sysuserService.getUserByUserId(userId);
  const upsertResult = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const tag of tags) {
    let toBeUpsert = {
      cTagId: tag.id,
      iStatus: true,
      cName: tag.name,
      cTagType: tag.type,
      cDeviceAddress: device.address,
      cDeviceName: device.name,
      cDeviceId: device.id,
      cTagAddress: tag.address,
      cTagMemAddress: tag.memaddress,
      cMeterFk: cMeterGuid,
    };
    // eslint-disable-next-line no-await-in-loop
    const emsTag = await prisma.EMS_Tag.findMany({
      where: {
        AND: {
          cTagId: tag.id,
          cMeterFk: cMeterGuid,
        },
      },
    });
    if (emsTag[0]) {
      toBeUpsert = Object.assign(toBeUpsert, {
        cModifyUserId: sysUser.userid,
        cModifyUserName: sysUser.username,
        dModifyTime: new Date(),
      });
      // eslint-disable-next-line no-await-in-loop
      await prisma.EMS_Tag.updateMany({
        where: {
          AND: {
            cTagId: tag.id,
            cMeterFk: cMeterGuid,
          },
        },
        data: toBeUpsert,
      });
      upsertResult.push({
        type: 'update',
        tagId: tag.id,
      });
    } else {
      toBeUpsert = Object.assign(toBeUpsert, {
        dCreateTime: new Date(),
        cCreateUserId: sysUser.userid,
        cCreateUserName: sysUser.username,
      });
      // eslint-disable-next-line no-await-in-loop
      await prisma.EMS_Tag.create({
        data: toBeUpsert,
      });
      upsertResult.push({
        type: 'create',
        tagId: tag.id,
      });
    }
  }

  return { isok: true, data: upsertResult, message: 'tag upsert success' };
};

/**
 * Get All Active Devices from RHUB
 * @returns {Promise<any>}
 */
const getActiveHubDevices = async () => {
  const queryUrl = `${config.RHUB_URL}/api/external/getactivedevicelist`;
  try {
    const response = await axios.get(queryUrl);
    return { isok: true, data: response.data, message: 'hub devices get success' };
  } catch (err) {
    return { isok: false, data: null, message: err.message };
  }
};

/**
 * Get All RHUB Tags by DeviceId
 * @param {string} deviceId - Device Id from RHUB
 * @returns {Promise<any>}
 */
const getTagsByDeviceId = async (deviceId) => {
  const queryUrl = `${config.RHUB_URL}/api/external/getdevicevaluesbyId?deviceId=${deviceId}`;
  try {
    const response = await axios.get(queryUrl);
    return { isok: true, data: response.data, message: 'hub taglist get success' };
  } catch (err) {
    return { isok: false, data: null, message: err.message };
  }
};

/**
 * Get All RHUB Tags by Binded Meter
 * @param {string} cMeterFk - Meter cGuid
 * @returns {Promise<any>}
 */
const getTagsByMeterFk = async (cMeterFk) => {
  const tags = await prisma.EMS_Tag.findMany({
    where: {
      cMeterFk,
    },
  });
  return { isok: true, data: tags, message: 'success' };
};

module.exports = {
  getall,
  pagination,
  getById,
  getByDeviceId,
  updateFriendlyNameById,
  deleteById,
  bindWithMeter,
  getActiveHubDevices,
  getTagsByDeviceId,
  getTagsByMeterFk,
};
