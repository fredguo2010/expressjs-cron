/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const cronClient = require('cron');
const dayjs = require('dayjs');
const prisma = require('./prisma');
const influxService = require('../services/influxdb/influxdb.service');
const tagService = require('../services/ems/tag.service');

/**
 * Steps to write Meter Raw Data from InfluxDB
 * 1. Query all the tags data from InfluxDB baed on regex match
 * 2. Query all the diff tags data from InfluxDB on regex match
 * 3. Mapping the Data Array for DB Table structure
 * 4. Pushing to SQLDB
 */
const writeRawData = async () => {
  console.log('Starting cron job for raw data writing...');
  console.time('Query InfluxDB');
  const influxResults = await influxService.getInfluxDataByQueryParam('-30m', '15m', 'last');
  const influxDiffData = await influxService.getInfluxDiffDataByQueryParam('-30m', '15m', 'last');
  console.timeEnd('Query InfluxDB');
  console.log(`Influx Data Query Completed, Data Length: ${influxDiffData.length}`);

  const influxResultCombined = influxResults
    // eslint-disable-next-line array-callback-return
    .map((el, index, array) => {
      if (index % 2 === 0 && index + 1 < array.length) {
        return {
          cTagId: el.tagId,
          tagName: el.tagName,
          time: el.time,
          cValueStart: el.value,
          cValueEnd: array[index + 1].value,
        };
      }
    })
    .filter((combined) => combined !== undefined);

  const tobeRecord = influxDiffData.map((el, index) => {
    return {
      cTagId: el.tagId,
      cTagName: el.tagName,
      dRecordTime: dayjs().startOf('minute'),
      cValueStart: influxResultCombined[index].cValueStart,
      cValueEnd: influxResultCombined[index].cValueEnd,
      cDiffValue: el.value,
    };
  });

  // Push to SQL DB EMS_RawRecord Table
  const result = await prisma.EMS_RawRecord.createMany({
    data: tobeRecord,
  });
  console.log(`Wrting Complete`);
};

/** *
 * Steps to Write Data to Hourly Report Table from EMS_RawRecord Table
 * 1. Query All hourly data from influxDB
 * 2. Query All EMS Tags from DB
 * 3. Joinint the tobeRecord data based on meterFk
 * 4. Wrting the hourly Data to DB
 */
const writeHourlyData = async () => {
  try {
    console.log('Starting cron job for ems hourly report data writing...');
    console.time('Query InfluxDB Hourly for Report');
    const hourlyRawData = await influxService.retriveHourlyConsumedData();
    console.timeEnd('Query InfluxDB Hourly for Report');
    const emsTags = await tagService.getall();
    const tobeRecord = hourlyRawData.map((el, index) => {
      const isMeterExist = emsTags.find((tag) => tag.cTagId === el.cTagId);
      let cMeterFk = null;
      if (isMeterExist) {
        cMeterFk = isMeterExist.cMeterFk;
      }
      return {
        cMeterFk: cMeterFk,
        cTagId: el.cTagId,
        cTagName: el.cTagName,
        dRecordTime: dayjs().startOf('hour'),
        cValueStart: el.cValueStart,
        cValueEnd: el.cValueEnd,
        cDiffValue: el.cDiffValue,
      };
    });
    const result = await prisma.EMS_ReportHour.createMany({
      data: tobeRecord,
    });
    writeCronToSysJobLog('cron', 'write record data hourly', `success, data length: ${tobeRecord.length}`, 1, null);
  } catch (e) { 
    writeCronToSysJobLog('cron', 'write record data hourly', `failed`, 0, e.message);
  }

};

/** *
 * Steps to Write Data to Hourly Report Table from EMS_RawRecord Table
 * 1. Query All daily data from influxDB
 * 2. Query All EMS Tags from DB
 * 3. Joinint the tobeRecord data based on meterFk
 * 4. Wrting the hourly Data to DB
 */
const writeDailyData = async () => {
  try {
    console.log('Starting cron job for ems daily report data writing...');
    const todayTime = dayjs();
    const yesterdayTime = dayjs().startOf('day').subtract(1, 'day');
    const hourlyDataSumed = await prisma.EMS_RawRecordHourly.groupBy({
      by: ['cTagId', 'cTagName'],
      _sum: {
        cDiffValue: true,
      },
      _min: {
        cValueStart: true,
      },
      _max: {
        cValueEnd: true,
      },
      where: {
        dEnd: {
          lte: todayTime,
          gt: yesterdayTime,
        },
      },
    });
    const emsTags = await tagService.getall();
    const tobeRecord = hourlyDataSumed.map((el, index) => {
      const isMeterExist = emsTags.find((tag) => tag.cTagId === el.cTagId);
      let cMeterFk = null;
      if (isMeterExist) {
        cMeterFk = isMeterExist.cMeterFk;
      }
      return {
        cMeterFk: cMeterFk,
        cTagId: el.cTagId,
        cTagName: el.cTagName,
        dDateTime: dayjs().startOf('hour').subtract(1, 'day'),
        cValueStart: el._min.cValueStart,
        cValueEnd: el._max.cValueEnd,
        cDiffValue: el._sum.cDiffValue,
      };
    });
    const result = await prisma.EMS_ReportDay.createMany({
      data: tobeRecord,
    });
    writeCronToSysJobLog('cron', 'write record data daily', `success, data length: ${tobeRecord.length}`, 1, null);
  } catch (e) { 
    writeCronToSysJobLog('cron', 'write record data daily', `failed`, 0, e.message);
  }

};

const writeRawData15m = async () => {
  try {
    console.log('Starting cron job for 15min raw data writing...');
    console.time('Query InfluxDB 15m');
    const tobeRecord = await influxService.retrive15mConsumedData();
    console.timeEnd('Query InfluxDB 15m');
    console.log(`writeRawData15m Query Completed, Data Length: ${tobeRecord.length}`);
    const result = await prisma.EMS_RawRecord.createMany({
      data: tobeRecord,
    });
    console.log(`writeRawData15m Write Completed, Data Length: ${tobeRecord.length}`);
    writeCronToSysJobLog('cron', 'write raw data 15m', `success, data length: ${tobeRecord.length}`, 1, null);
  } catch (e) { 
    writeCronToSysJobLog('cron', 'write raw data hourly', 'failed', 0, e.message);
  }
};

const writeRawDataHourly = async () => {
  try {
    console.log('Starting cron job for hourly raw data writing...');
    console.time('Query InfluxDB Hourly for Raw Data');
    const tobeRecord = await influxService.retriveHourlyConsumedData();
    console.timeEnd('Query InfluxDB Hourly for Raw Data');
    console.log(`writeRawDataHourly Query Completed, Data Length: ${tobeRecord.length}`);
    const result = await prisma.EMS_RawRecordHourly.createMany({
      data: tobeRecord,
    });
    console.log(`writeRawDataHourly Write Completed, Data Length: ${tobeRecord.length}`);
    writeCronToSysJobLog('cron', 'write raw data hourly', `success, data length: ${tobeRecord.length}`, 1, null);
  } catch (e) { 
    writeCronToSysJobLog('cron', 'write raw data hourly', 'failed', 0, e.message);
  }
};


const writeCronToSysJobLog = async (jobType, jobName, resultInfo, status, errorInfo) => { 
  const result = await prisma.Sys_Job_Log.create({
    data: {
      end_time: dayjs().startOf('minute'),
      start_time: dayjs().startOf('minute'),
      result_info: resultInfo,
      status: status,
      cJobType: jobType,
      cJobName: jobName,
      error_info: errorInfo,
    },
  });
}

const initCron = async () => {
  // Cron JOb for Write Raw Data from InfluxDB every 15 minutes
  const jobRaw15 = new cronClient.CronJob('2 0/15 * * * *', writeRawData15m, null, true, 'Asia/Shanghai');
  const jobRawHourly = new cronClient.CronJob('2 0 * * * * ', writeRawDataHourly, null, true, 'Asia/Shanghai');
  // Cron Job for Every Hour to Record Meter Data from InfluxDB
  const jobHourly = new cronClient.CronJob('2 0 * * * * ', writeHourlyData, null, true, 'Asia/Shanghai');
  // Cron Job for Every Day to Record Meter Data aggregated from Hourly Data
  const jobDaily = new cronClient.CronJob('0 2 0 * * *', writeDailyData, null, true, 'Asia/Shanghai');
};

module.exports = {
  initCron,
  writeRawData,
  writeHourlyData,
  writeDailyData,
  writeRawData15m,
  writeRawDataHourly,
};
