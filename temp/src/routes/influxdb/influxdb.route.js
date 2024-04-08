const express = require('express');
const influxdbController = require('../../controllers/influxdb/influxdb.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const influxdbValidation = require('../../validations/influxdb/influxdb.validation')

const router = express.Router();

router.route('/getDataByTagId').get(validate(influxdbValidation.getInfluxDataByTagId), influxdbController.getInfluxDataByTagId);
router.route('/getDiffDataByTagId').get(validate(influxdbValidation.getInfluxDataByTagId), influxdbController.getInfluxDiffDataByTagId);
router.route('/getDataByDeviceAndName').get(validate(influxdbValidation.getInfluxDataByDeviceAndName), influxdbController.getInfluxDataByDeviceAndName);

module.exports = router;

/**
 * @swagger
 * projects:
 *   name: InfluxDB
 *   description: InfluxDB
 */

/**
 * @swagger
 * /api/influxdb/getDataByTagId:
 *   get:
 *     summary: Get values by tag id
 *     description: Get values by tag id
 *     tags: [InfluxDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: Influxdb Tag ID
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: Influxdb Start Time
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Influxdb query interval
 *       - in: query
 *         name: queryType
 *         schema:
 *           type: string
 *         description: Influxdb queryType
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cloud_project'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/influxdb/getDiffDataByTagId:
 *   get:
 *     summary: Get values by tag id
 *     description: Get values by tag id
 *     tags: [InfluxDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tagId
 *         schema:
 *           type: string
 *         description: Influxdb Tag ID
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: Influxdb Start Time
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Influxdb query interval
 *       - in: query
 *         name: queryType
 *         schema:
 *           type: string
 *         description: Influxdb queryType
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cloud_project'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */


/**
 * @swagger
 * /api/influxdb/getDataByDeviceAndName:
 *   get:
 *     summary: Get values by device and name
 *     description: Get values by device and name
 *     tags: [InfluxDB]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: device
 *         schema:
 *           type: string
 *         description: Influxdb Device Filter
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Influxdb Name Filter
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *         description: Influxdb Start Time
 *       - in: query
 *         name: interval
 *         schema:
 *           type: string
 *         description: Influxdb query interval
 *       - in: query
 *         name: queryType
 *         schema:
 *           type: string
 *         description: Influxdb queryType
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cloud_project'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

