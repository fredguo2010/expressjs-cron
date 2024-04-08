const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emsSubItemService } = require('../../services');
const pick = require('../../utils/pick');

const getall = catchAsync(async (req, res) => {
  const data = await emsSubItemService.getall();
  res.status(httpStatus.OK).send({ isok: true, data });
});

const pagination = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cName']);
  const options = pick(req.query, ['orderBy', 'row', 'page']);
  const filter = { AND: [] };
  if (queryobj.cName) {
    filter.AND.push({
      cName: {
        contains: queryobj.cName,
      },
    });
  }
  const result = await emsSubItemService.pagination(filter, options);
  res.send(result);
});

const getById = catchAsync(async (req, res) => {
  const subsitute = await emsSubItemService.getById(req.params.cGuid);
  if (!subsitute) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subitem not found');
  }
  res.send(subsitute);
});

const add = catchAsync(async (req, res) => {
  const subsitute = await emsSubItemService.add(req.body);
  res.send(subsitute);
});

const updateById = catchAsync(async (req, res) => {
  const subsitute = await emsSubItemService.updateById(req.params.cGuid, req.body);
  res.send(subsitute);
});

const deleteById = catchAsync(async (req, res) => {
  const subsitute = await emsSubItemService.deleteById(req.params.cGuid);
  res.send(subsitute);
});

const getTreeNodes = catchAsync(async (req, res) => {
  const subsitute = await emsSubItemService.getTreeNodes();
  res.send(subsitute);
});

module.exports = {
  getall,
  pagination,
  getById,
  add,
  updateById,
  deleteById,
  getTreeNodes,
};
