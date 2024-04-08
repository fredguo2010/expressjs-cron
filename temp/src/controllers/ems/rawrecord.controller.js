const catchAsync = require('../../utils/catchAsync');
const { emsRawRecordService } = require('../../services');
const pick = require('../../utils/pick');

const getRecentRawRecordsByTagId = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cTagId', 'startTime', 'endTime']);
  const filter = { AND: [] };
  if (queryobj.cTagId) {
    filter.AND.push({
      cTagId: queryobj.cTagId,
    });
  }
  if (queryobj.startTime && queryobj.endTime) {
    filter.AND.push({
      dRecordTime: {
        gte: new Date(queryobj.startTime),
        lte: new Date(queryobj.endTime),
      },
    });
  }

  const result = await emsRawRecordService.getRecentRawRecordsByTagId(filter);
  res.send(result);
});

const getOmniHoraRawRecordsByTagId = catchAsync(async (req, res) => {
  const queryobj = pick(req.query, ['cTagId', 'startTime', 'endTime']);
  const startTime = new Date(queryobj.startTime);
  startTime.setHours(startTime.getHours() - 8);
  const endTime = new Date(queryobj.endTime);
  endTime.setHours(endTime.getHours() - 8);
  const result = await emsRawRecordService.getOmniHoraRawRecordsByTagId(startTime, endTime, queryobj.cTagId);
  res.send(result);
});

module.exports = {
  getRecentRawRecordsByTagId,
  getOmniHoraRawRecordsByTagId,
};
