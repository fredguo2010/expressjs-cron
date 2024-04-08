const cronClient = require('cron');
const prisma = require('./prisma');
const influxService = require('../services/influxdb/influxdb.service');
const dayjs = require('dayjs');

const initCron = async () => {
  // Cron JOb for Write Raw Data from InfluxDB every 15 minutes
  const jobRaw15 = new cronClient.CronJob('0 2/15 * * * *', writeRawData15m, null, true, 'Asia/Shanghai');
  const jobRawHourly = new cronClient.CronJob('0 2 * * * *', writeRawDataHourly, null, true, 'Asia/Shanghai');
  // // Cron Job for Every Hour to Record Meter Data from InfluxDB
  // const jobHourly = new cronClient.CronJob('0 0 * * * *', writeHourlyData, null, true, 'Asia/Shanghai');
  // // Cron Job for Every Day to Record Meter Data from InfluxDB
  // const jobDaily = new cronClient.CronJob('0 0 0 * * *', writeDailyData, null, true, 'Asia/Shanghai');
};

/***
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
    .map((el, index, array) => {
      if (index % 2 === 0 && index + 1 < array.length) {
        return {
          cTagId: el.tagId,
          tagName: el.tagName,
          time: el.time,
          cValueStart: el?.value,
          cValueEnd: array[index + 1]?.value,
        };
      }
    })
    .filter((combined) => combined !== undefined);

  const tobeRecord = influxDiffData.map((el, index) => {
    return {
      cTagId: el.tagId,
      cTagName: el.tagName,
      dRecordTime: dayjs().startOf('minute'),
      cValueStart: influxResultCombined[index]?.cValueStart,
      cValueEnd: influxResultCombined[index]?.cValueEnd,
      cDiffValue: el?.value,
    };
  });

  // Push to SQL DB EMS_RawRecord Table
  const result = await prisma.EMS_RawRecord.createMany({
    data: tobeRecord,
  });
  console.log(`Wrting Complete`);
};

/***
 * Steps to Write Data to Hourly Report Table from EMS_RawRecord Table
 * TODO:
 * 1. Query All the Data from 1 hour ago to now
 * 2. Aggregate to Sum the cDiffValue based on 1 hour
 * 3. Joining the Meter ID based on cTagId
 * 4. Wrting the Data to DB
 */
const writeHourlyData = async () => {};

const writeDailyData = async () => {};

const writeRawData15m = async () => {
  console.log('Starting cron job for raw data writing...');
  console.time('Query InfluxDB 15m');
  const tobeRecord = await influxService.retrive15mConsumedData();
  console.timeEnd('Query InfluxDB 15m');
  console.log(`writeRawData15m Query Completed, Data Length: ${tobeRecord.length}`);
  const result = await prisma.EMS_RawRecord.createMany({
    data: tobeRecord,
  });

  console.log(`writeRawData15m Write Completed, Data Length: ${tobeRecord.length}`);
};

const writeRawDataHourly = async () => {
  console.log('Starting cron job for raw data writing...');
  console.time('Query InfluxDB Hourly');
  const tobeRecord = await influxService.retriveHourlyConsumedData();
  console.timeEnd('Query InfluxDB Hourly');
  console.log(`writeRawDataHourly Query Completed, Data Length: ${tobeRecord.length}`);
  const result = await prisma.EMS_RawRecordHourly.createMany({
    data: tobeRecord,
  });
  console.log(`writeRawDataHourly Write Completed, Data Length: ${tobeRecord.length}`);
};

module.exports = {
  initCron,
  writeRawData,
  writeHourlyData,
  writeRawData15m,
  writeRawDataHourly,
};
