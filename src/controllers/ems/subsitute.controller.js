const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { emsSubsituteService } = require('../../services');
const pick = require('../../utils/pick');

const uploadCoverPicture = catchAsync(async (req, res) => {
  res.json({ file: req.file });
});

const getall = catchAsync(async (req, res) => {
  const data = await emsSubsituteService.getall();
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
  const result = await emsSubsituteService.pagination(filter, options);
  res.send(result);
});

const getEmsSubsituteById = catchAsync(async (req, res) => {
  const subsitute = await emsSubsituteService.getEmsSubsituteById(req.params.cGuid);
  if (!subsitute) {
    throw new ApiError(httpStatus.NOT_FOUND, 'subsitute not found');
  }
  res.send(subsitute);
});

const addEmsSubsitute = catchAsync(async (req, res) => {
  const subsitute = await emsSubsituteService.addEmsSubsitute(req.body);
  res.send(subsitute);
});

const updateById = catchAsync(async (req, res) => {
  const subsitute = await emsSubsituteService.updateById(req.params.cGuid, req.body);
  res.send(subsitute);
});

const deleteById = catchAsync(async (req, res) => {
  const subsitute = await emsSubsituteService.deleteById(req.params.cGuid);
  res.send(subsitute);
});

const getTreeNodes = catchAsync(async (req, res) => {
  const subsitute = await emsSubsituteService.getTreeNodes();
  res.send(subsitute);
});

module.exports = {
  uploadCoverPicture,
  getall,
  pagination,
  getEmsSubsituteById,
  addEmsSubsitute,
  updateById,
  deleteById,
  getTreeNodes,
};
