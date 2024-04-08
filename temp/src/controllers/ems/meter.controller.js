const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emsMeterService, influxdbService } = require('../../services');
const pick = require('../../utils/pick');

const getall = catchAsync(async (req, res) => {
  const data = await emsMeterService.getall();
  res.status(httpStatus.OK).send({ isok: true, data });
});

const pagination = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cName', 'cPositionFk', 'cSubsituteFk', 'cSubItemFk']);
  const options = pick(req.query, ['orderBy', 'row', 'page']);
  const filter = { AND: [] };
  if (queryobj.cName) {
    filter.AND.push({
      cName: {
        contains: queryobj.cName,
      },
    });
  }
  if (queryobj.cPositionFk) {
    filter.AND.push({
      cPositionFk: {
        contains: queryobj.cPositionFk,
      },
    });
  }
  if (queryobj.cSubsituteFk) {
    filter.AND.push({
      cSubsituteFk: {
        contains: queryobj.cSubsituteFk,
      },
    });
  }
  if (queryobj.cSubItemFk) {
    filter.AND.push({
      cSubItemFk: {
        contains: queryobj.cSubItemFk,
      },
    });
  }
  const result = await emsMeterService.pagination(filter, options);
  res.send(result);
});

const getTreeNodes = catchAsync(async (req, res) => {
  const data = await emsMeterService.getTreeNodes();
  res.status(httpStatus.OK).send(data);
});

const getTreeNodesWithEccdTags = catchAsync(async (req, res) => {
  const data = await emsMeterService.getTreeNodesWithEccdTags();
  res.status(httpStatus.OK).send(data);
});

const getTreeNodesWithTags = catchAsync(async (req, res) => {
  const data = await emsMeterService.getTreeNodesWithTags();
  res.status(httpStatus.OK).send(data);
});

const getEmsMeterById = catchAsync(async (req, res) => {
  const meter = await emsMeterService.getEmsMeterById(req.params.cGuid);
  if (!meter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'meter not found');
  }
  res.send(meter);
});

const addEmsMeter = catchAsync(async (req, res) => {
  const meter = await emsMeterService.addEmsMeter(req.body);
  res.send(meter);
});

const updateById = catchAsync(async (req, res) => {
  const meter = await emsMeterService.updateById(req.params.cGuid, req.body);
  res.send(meter);
});

const deleteById = catchAsync(async (req, res) => {
  const meter = await emsMeterService.deleteById(req.params.cGuid);
  res.send(meter);
});

const retriveHourlyConsumedData = catchAsync(async (req, res) => {
  const meter = await influxdbService.retriveHourlyConsumedData();
  res.send(meter);
});

const retrive15mConsumedData = catchAsync(async (req, res) => {
  const meter = await influxdbService.retrive15mConsumedData();
  res.send(meter);
});

module.exports = {
  getall,
  pagination,
  getTreeNodes,
  getTreeNodesWithEccdTags,
  getTreeNodesWithTags,
  getEmsMeterById,
  addEmsMeter,
  updateById,
  deleteById,
  retriveHourlyConsumedData,
  retrive15mConsumedData,
};
