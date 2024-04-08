const express = require('express');
const emsMeterController = require('../../controllers/ems/meter.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emsMeterValidation = require('../../validations/ems/meter.validation');

const router = express.Router();

router.route('/getall').get(validate(emsMeterValidation.getall), emsMeterController.getall);

router.route('/retrivehourlydata').get(emsMeterController.retriveHourlyConsumedData);
router.route('/retrive15mdata').get(emsMeterController.retrive15mConsumedData);

router.route('/pagination').get(validate(emsMeterValidation.getMeter), emsMeterController.pagination);

router.route('/treenodes').get(emsMeterController.getTreeNodes);

router.route('/treenodeswitheccdtags').get(emsMeterController.getTreeNodesWithEccdTags);

router.route('/treenodeswithtags').get(emsMeterController.getTreeNodesWithTags);

router.route('/add').post(validate(emsMeterValidation.createEmsMeter), emsMeterController.addEmsMeter);

router
  .route('/item/:cGuid')
  .get(auth('get'), validate(emsMeterValidation.getEmsMeterById), emsMeterController.getEmsMeterById)
  .put(auth('manages'), validate(emsMeterValidation.updateById), emsMeterController.updateById)
  .delete(auth('manages'), validate(emsMeterValidation.deleteById), emsMeterController.deleteById);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS Meter
 */
/**
 * @swagger
 * /api/ems/meter/getall:
 *   get:
 *     summary: Get all meters
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/retrivehourlydata:
 *   get:
 *     summary: retrivehourlydata
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/retrive15mdata:
 *   get:
 *     summary: retrive15mdata
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/getall:
 *   get:
 *     summary: Get all meters
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/treenodes:
 *   get:
 *     summary: Get Meters treenodes
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/treenodeswitheccdtags:
 *   get:
 *     summary: Get Meters treenodeswitheccdtags
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
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
 * /api/ems/meter/add:
 *   post:
 *     summary: add ems meter
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/meter/item/{cGuid}:
 *   get:
 *     summary: Get a ems meter by id
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
 *         description: ems meter cGuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update a ems meter
 *     description: update ems meter item based on id
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems meter cGuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a ems meter
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
 *         description: ems meter cGuid
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
