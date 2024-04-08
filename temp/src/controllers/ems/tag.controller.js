const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emsTagService } = require('../../services');
const pick = require('../../utils/pick');
const cron = require('../../core/cron');

const getall = catchAsync(async (req, res) => {
  const data = await emsTagService.getall();
  res.status(httpStatus.OK).send({ isok: true, data });
});

const pagination = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cName', 'cMeterFk', 'iStatus']);
  const options = pick(req.query, ['orderBy', 'row', 'page']);
  const filter = { AND: [] };
  if (queryobj.iStatus) {
    filter.AND.push({
      iStatus: queryobj.iStatus,
    });
  }
  if (queryobj.cName) {
    filter.AND.push({
      cName: {
        contains: queryobj.cName,
      },
    });
  }
  if (queryobj.cMeterFk) {
    filter.AND.push({
      cMeterFk: {
        contains: queryobj.cMeterFk,
      },
    });
  }
  const result = await emsTagService.pagination(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const tag = await emsTagService.getById(req.params.cGuid);
  if (!tag) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ems tag not found');
  }
  res.send(tag);
});

const updateFriendlyName = catchAsync(async (req, res) => {
  const { cGuid } = req.params;
  const { cFriendlyName } = req.body;
  const tag = await emsTagService.updateFriendlyNameById(cGuid, cFriendlyName);
  res.send({ isok: true, data: tag, message: 'success' });
});

const deleteById = catchAsync(async (req, res) => {
  const tag = await emsTagService.deleteById(req.params.cGuid);
  res.send(tag);
});

const bindWithMeter = catchAsync(async (req, res) => {
  const { cMeterGuid, device, tags, userId } = req.body;
  const upsertResult = await emsTagService.bindWithMeter(cMeterGuid, device, tags, userId);
  res.send(upsertResult);
});

const getActiveHubDevices = catchAsync(async (req, res) => {
  const devicesResult = await emsTagService.getActiveHubDevices();
  res.send(devicesResult);
});

const getTagsByDeviceId = catchAsync(async (req, res) => {
  const { deviceId } = req.query;
  const tagsResult = await emsTagService.getTagsByDeviceId(deviceId);
  res.send(tagsResult);
});

const getTagsByMeterFk = catchAsync(async (req, res) => {
  const { cMeterFk } = req.query;
  const tagsResult = await emsTagService.getTagsByMeterFk(cMeterFk);
  res.send(tagsResult);
});

const testCronHour = catchAsync(async (req, res) => {
  const testResult = await cron.writeHourlyData();
  res.send(testResult);
});

const testCron15Min = catchAsync(async (req, res) => {
  const testResult = await cron.writeRawData();
  res.send(testResult);
});

module.exports = {
  getall,
  pagination,
  getById,
  updateFriendlyName,
  deleteById,
  bindWithMeter,
  getActiveHubDevices,
  getTagsByDeviceId,
  getTagsByMeterFk,
  testCronHour,
  testCron15Min,
};
