const { InfluxDB } = require('@influxdata/influxdb-client');
const { flux } = require('@influxdata/influxdb-client');
const { fluxDuration } = require('@influxdata/influxdb-client');
const { fluxExpression } = require('@influxdata/influxdb-client');
// eslint-disable-next-line import/no-extraneous-dependencies
const dayjs = require('dayjs');
const config = require('../../config/config');

// Init INFLUXDB configuration with defined env profile
const { INFLUXDB_URL } = config;
const { INFLUXDB_TOKEN } = config;
const { INFLUXDB_ORG } = config;
const { INFLUXDB_BUCKET } = config;

let client = null;
let clientOptions = null;
let queryApi = null;
const timeout = 30000; // 30 seconds
clientOptions = {
  url: INFLUXDB_URL,
  token: INFLUXDB_TOKEN,
  timeout,
};
client = new InfluxDB(clientOptions);
queryApi = client.getQueryApi(INFLUXDB_ORG);

function getInfluxDataByTagId(tagId, start, interval, queryType) {
  const startFormatted = fluxDuration(`${start}`);
  const intervalFormatted = fluxDuration(`${interval}`);
  const queryTypeFormatted = fluxExpression(`${queryType}`);
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: "${INFLUXDB_BUCKET}")
                      |> range(start: ${startFormatted})
                      |> filter(fn: (r) => r["_measurement"] == ${tagId})
                      |> aggregateWindow(every: ${intervalFormatted}, fn: ${queryTypeFormatted}, createEmpty: false)`;
    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push({
          time: dayjs(o._time).toISOString(),
          value: o._value,
        });
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      },
    });
  });
}

function getInfluxDataByQueryParam(start, interval, queryType) {
  const startFormatted = fluxDuration(`${start}`);
  const intervalFormatted = fluxDuration(`${interval}`);
  const queryTypeFormatted = fluxExpression(`${queryType}`);
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: "${INFLUXDB_BUCKET}")
                      |> range(start: ${startFormatted})
                      |> filter(fn: (r) => exists r._field and r["name"] =~ /ECCD/)
                      |> aggregateWindow(every: ${intervalFormatted}, fn: ${queryTypeFormatted}, createEmpty: false)`;
    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push({
          tagId: o._measurement,
          tagName: o.name,
          time: dayjs(o._time).toISOString(),
          value: o._value,
        });
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      },
    });
  });
}

function getInfluxDiffDataByTagId(tagId, start, interval, queryType) {
  const startFormatted = fluxDuration(`${start}`);
  const intervalFormatted = fluxDuration(`${interval}`);
  const queryTypeFormatted = fluxExpression(`${queryType}`);
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: "${INFLUXDB_BUCKET}")
                      |> range(start: ${startFormatted})
                      |> filter(fn: (r) => r["_measurement"] == ${tagId})
                      |> aggregateWindow(every: ${intervalFormatted}, fn: ${queryTypeFormatted}, createEmpty: false)
                      |> difference()`;
    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push({
          time: dayjs(o._time).toISOString(),
          value: o._value,
        });
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      },
    });
  });
}

function getInfluxDiffDataByQueryParam(start, interval, queryType) {
  const startFormatted = fluxDuration(`${start}`);
  const intervalFormatted = fluxDuration(`${interval}`);
  const queryTypeFormatted = fluxExpression(`${queryType}`);
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: "${INFLUXDB_BUCKET}")
                      |> range(start: ${startFormatted})
                      |> filter(fn: (r) => exists r._field and r["name"] =~ /ECCD/)
                      |> aggregateWindow(every: ${intervalFormatted}, fn: ${queryTypeFormatted}, createEmpty: false)
                      |> difference()`;
    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push({
          tagId: o._measurement,
          tagName: o.name,
          time: dayjs(o._time).toISOString(),
          value: o._value,
        });
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      },
    });
  });
}

function getInfluxDataByDeviceAndName(device, name, start, interval, queryType) {
  const startFormatted = fluxDuration(`${start}`);
  const intervalFormatted = fluxDuration(`${interval}`);
  const queryTypeFormatted = fluxExpression(`${queryType}`);
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: "${INFLUXDB_BUCKET}")
                      |> range(start: ${startFormatted})
                      |> filter(fn: (r) => r["device"] == ${device})
                      |> filter(fn: (r) => r["name"] == "${name}")
                      |> aggregateWindow(every: ${intervalFormatted}, fn: ${queryTypeFormatted}, createEmpty: false)`;
    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push([dayjs(o._time).toISOString(), o._value]);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(result);
      },
    });
  });
}

function convertData(inputArray) {
  const groupedData = inputArray.reduce((acc, obj) => {
    if (!acc[obj.name]) {
      acc[obj.name] = [];
    }
    acc[obj.name].push(obj);
    // Sort the array by date within each group
    acc[obj.name].sort((a, b) => new Date(a._time) - new Date(b._time));
    return acc;
  }, {});

  const resultArray = Object.values(groupedData)
    .map((group) => {
      return group.slice(0, -1).map((startObj, i) => {
        const endObj = group[i + 1];
        // Set the Diff Val to 0 when the PLC program or comm failed
        let calcValue;
        if (!endObj._value || !startObj._value || endObj._value - startObj._value < 0) {
          calcValue = 0;
        } else { 
          calcValue = endObj._value - startObj._value;
        }

        return {
          cTagId: startObj.id,
          cTagName: startObj.name,
          dRecordTime: new Date(),
          cValueStart: startObj._value,
          dStart: startObj._time,
          cValueEnd: endObj._value,
          cDiffValue: calcValue,
          dEnd: endObj._time,
          dTime: endObj._time,
          cDate: new Date(endObj._time).toISOString().slice(0, 10).replace(/[-]/g, ''),
          cHour: new Date(endObj._time).toISOString().slice(11, 16),
        };
      });
    })
    .flat();

  return resultArray;
}

function retriveHourlyConsumedData() {
  // Get the current date and time
  const now = new Date();

  // Subtract an hour to get the start time
  const oneHourAgo = new Date(now);
  oneHourAgo.setHours(now.getHours() - 2);
  oneHourAgo.setMinutes(0);
  oneHourAgo.setSeconds(0);
  oneHourAgo.setMilliseconds(0);

  // Set the end time to now with seconds set to 59
  // Update: set the end time to the start of current hour
  const endDateTime = new Date(now);
  // endDateTime.setHours(now.getHours() - 1);
  // endDateTime.setMinutes(59);
  // endDateTime.setSeconds(59);
  endDateTime.setMinutes(0);
  endDateTime.setSeconds(0);
  endDateTime.setMilliseconds(0);

  // Format the dates (optional)
  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: ${INFLUXDB_BUCKET})
                          |> range(start: ${oneHourAgo},stop:${endDateTime})
                          |> filter(fn: (r) => exists r._field and r["name"] =~ /ECCD/)
                          |> aggregateWindow(every: 1h, fn: max)`;

    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(convertData(result));
      },
    });
  });
}

function retrive15mConsumedData() {
  // Get the current date and time
  const now = new Date();
  const nowminutes = now.getMinutes();

  // Subtract an hour to get the start time
  const endtime = new Date(now);
  endtime.setMinutes(endtime.getMinutes() - (nowminutes % 15));
  endtime.setSeconds(0);
  endtime.setMilliseconds(0);

  // Set the end time to now with seconds set to 59
  const starttime = new Date(now);
  starttime.setMinutes(endtime.getMinutes() - 30);
  starttime.setSeconds(0);
  starttime.setMilliseconds(0);

  // Format the dates (optional)
  console.log(endtime);
  console.log(starttime);

  return new Promise(function (resolve, reject) {
    const query = flux`from(bucket: ${INFLUXDB_BUCKET})
                          |> range(start: ${starttime},stop:${endtime})
                          |> filter(fn: (r) => exists r._field and r["name"] =~ /ECCD/)
                          |> aggregateWindow(every: 15m, fn: max)`;

    const result = [];
    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        result.push(o);
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(convertData(result));
      },
    });
  });
}

module.exports = {
  getInfluxDataByTagId,
  getInfluxDataByQueryParam,
  getInfluxDiffDataByTagId,
  getInfluxDiffDataByQueryParam,
  getInfluxDataByDeviceAndName,
  retriveHourlyConsumedData,
  retrive15mConsumedData,
};
