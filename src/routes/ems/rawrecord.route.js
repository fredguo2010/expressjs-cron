const express = require('express');
const emsRawRecordController = require('../../controllers/ems/rawrecord.controller');
const validate = require('../../middlewares/validate');
const emsRawRecordValidation = require('../../validations/ems/rawrecord.validation');
const auth = require('../../middlewares/auth');

const router = express.Router();

router
  .route('/getRecentRawRecordsByTagId')
  .get(
    auth('get'),
    validate(emsRawRecordValidation.getRecentRawRecordsByTagId),
    emsRawRecordController.getRecentRawRecordsByTagId
  );
router
  .route('/getOmniHoraRawRecordsByTagId')
  .get(
    auth('get'),
    validate(emsRawRecordValidation.getOmniHoraRawRecordsByTagId),
    emsRawRecordController.getOmniHoraRawRecordsByTagId
  );

module.exports = router;
/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS Meter
 */
/**
 * @swagger
 * /api/ems/rawrecord/getRecentRawRecordsByTagId:
 *   get:
 *     summary: get Recent Raw Records By Tag Id
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cTagId
 *         schema:
 *           type: string
 *         description: cTagId
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: date
 *         description: startTime
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: date
 *         description: endTime
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/rawrecord/getOmniHoraRawRecordsByTagId:
 *   get:
 *     summary: get Recent Raw Records By Tag Id
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cTagId
 *         schema:
 *           type: string
 *         description: cTagId
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: date
 *         description: startTime
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: date
 *         description: endTime
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
