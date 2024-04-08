const prisma = require('../../core/prisma');

const select = {
  cGuid: true,
  cTagId: true,
  cTagName: true,
  dRecordTime: true,
  cValueStart: true,
  cValueEnd: true,
  cDiffValue: true,
};

const getRecentRawRecordsByTagId = async (filter) => {
  const recentData = await prisma.EMS_RawRecord.findMany({
    select,
    where: filter,
    orderBy: {
      dRecordTime: 'asc',
    },
  });
  return { isok: true, msg: 'success', data: recentData };
};

const getOmniHoraRawRecordsByTagId = async (startTime, endTime, cTagId) => {
  const result = await prisma.$queryRaw`SELECT
	      TO_CHAR( DATE_TRUNC( 'hour', "dRecordTime" AT TIME ZONE'UTC' AT TIME ZONE'Asia/Shanghai' ), 'YY-MM-DD HH24' ) AS NAME,
        SUM("cDiffValue") AS value
        FROM
        "EMS_RawRecord"
        WHERE
        "cTagId" = ${cTagId} AND "dRecordTime" BETWEEN ${startTime} AND ${endTime}
        GROUP BY
        name
        ORDER BY
        name`;

  return {
    isok: true,
    msg: 'success',
    data: result,
  };
};

module.exports = {
  getRecentRawRecordsByTagId,
  getOmniHoraRawRecordsByTagId,
};
