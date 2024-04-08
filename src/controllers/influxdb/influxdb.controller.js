const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { influxdbService } = require('../../services');

const getInfluxDataByTagId = catchAsync(async (req, res) => {
  const { tagId, start, interval, queryType } = req.query;
  const values = await influxdbService.getInfluxDataByTagId(tagId, start, interval, queryType);
  res.status(httpStatus.OK).send({ isok: true, data: values });
});

const getInfluxDiffDataByTagId = catchAsync(async (req, res) => {
  const { tagId, start, interval, queryType } = req.query;
  const values = await influxdbService.getInfluxDiffDataByTagId(tagId, start, interval, queryType);
  res.status(httpStatus.OK).send({ isok: true, data: values });
});

const getInfluxDataByDeviceAndName = catchAsync(async (req, res) => {
  const { device, name, start, interval, queryType } = req.query;
  const values = await influxdbService.getInfluxDataByDeviceAndName(device, name, start, interval, queryType);
  res.status(httpStatus.OK).send({ isok: true, data: values });
});

module.exports = {
  getInfluxDataByTagId,
  getInfluxDiffDataByTagId,
  getInfluxDataByDeviceAndName
};
