const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emsPositionService } = require('../../services');
const pick = require('../../utils/pick');

const getall = catchAsync(async (req, res) => {
  const data = await emsPositionService.getall();
  res.status(httpStatus.OK).send({ isok: true, data });
});

const pagination = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cName', 'cParentGuid']);
  const options = pick(req.query, ['orderBy', 'row', 'page']);
  const filter = { AND: [] };
  if (queryobj.cName) {
    filter.AND.push({
      cName: {
        contains: queryobj.cName,
      },
    });
  }
  if (queryobj.cParentGuid) {
    filter.AND.push({
      cParentGuid: {
        contains: queryobj.cParentGuid,
      },
    });
  }
  const result = await emsPositionService.pagination(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const subsitute = await emsPositionService.getById(req.params.cGuid);
  if (!subsitute) {
    throw new ApiError(httpStatus.NOT_FOUND, 'position not found');
  }
  res.send(subsitute);
});

const getTreeNodes = catchAsync(async (req, res) => {
  const result = await emsPositionService.getTreeNodes();
  res.send(result);
});

const add = catchAsync(async (req, res) => {
  const subsitute = await emsPositionService.add(req.body);
  res.send(subsitute);
});

const updateById = catchAsync(async (req, res) => {
  const subsitute = await emsPositionService.updateById(req.params.cGuid, req.body);
  res.send(subsitute);
});

const deleteById = catchAsync(async (req, res) => {
  const subsitute = await emsPositionService.deleteById(req.params.cGuid);
  res.send(subsitute);
});

const getTagTreeNodes = catchAsync(async (req, res) => {
  const result = await emsPositionService.getTagTreeNodes();
  res.send(result);
});

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
