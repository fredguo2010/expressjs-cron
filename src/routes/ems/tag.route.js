const express = require('express');
const emsTagController = require('../../controllers/ems/tag.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emsTagValidation = require('../../validations/ems/tag.validation');

const router = express.Router();

router.route('/getall').get(validate(emsTagValidation.getall), emsTagController.getall);
router.route('/pagination').get(validate(emsTagValidation.get), emsTagController.pagination);

router
  .route('/item/:cGuid')
  .get(auth('get'), validate(emsTagValidation.getById), emsTagController.getById)
  .patch(auth('manages'), validate(emsTagValidation.updateFriendlyName), emsTagController.updateFriendlyName)
  .delete(auth('manages'), validate(emsTagValidation.deleteById), emsTagController.deleteById);

router
  .route('/bindWithMeter')
  .post(auth('manages'), validate(emsTagValidation.bindWithMeter), emsTagController.bindWithMeter);

router.route('/getHubDevices').get(auth('get'), validate(emsTagValidation.getall), emsTagController.getActiveHubDevices);

router
  .route('/getTagsByDeviceId')
  .get(auth('get'), validate(emsTagValidation.getTagsByDeviceId), emsTagController.getTagsByDeviceId);

router
  .route('/getTagsByMeterFk')
  .get(auth('get'), validate(emsTagValidation.getTagsByMeterFk), emsTagController.getTagsByMeterFk);

router.route('/testCronHourly').get(auth('get'), validate(emsTagValidation.getall), emsTagController.testCronHour);

router.route('/testCron15Min').get(auth('get'), validate(emsTagValidation.getall), emsTagController.testCron15Min);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS
 */
/**
 * @swagger
 * /api/ems/tag/getall:
 *   get:
 *     summary: Get all ems tags
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/subitem/pagination:
 *   get:
 *     summary: Get subitem Pagination
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cName
 *         schema:
 *           type: string
 *         description: Tag name
 *       - in: query
 *         name: cMeterFk
 *         schema:
 *           type: string
 *         description: Meter GUID
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: row
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of ems tag
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/tag/item/{cGuid}:
 *   get:
 *     summary: Get a ems tag by id
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems tag cGuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a ems tag
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems tag cGuid
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /api/ems/tag/bindWithMeter:
 *   post:
 *     summary: Bind ems tags with meter
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EMS_Tag_Bind_Meter'
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
/**
 * @swagger
 * /api/ems/tag/getHubDevices:
 *   get:
 *     summary: Get all RHUB active devices
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/tag/getTagsByDeviceId:
 *   get:
 *     summary: Get RHUB tags by deviceId
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: deviceId from RHUB
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/tag/getTagsByMeterFk:
 *   get:
 *     summary: Get  tags by MeterFk
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: MeterFk
 *         schema:
 *           type: string
 *         description: MeterFk
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ems_Tag'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/tag/testCronHourly:
 *   get:
 *     summary: test cron hour for meter record
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/tag/testCron15Min:
 *   get:
 *     summary: test cron hour for meter record
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
