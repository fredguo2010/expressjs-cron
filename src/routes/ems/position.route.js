const express = require('express');
const emsPositionController = require('../../controllers/ems/position.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emsPositionValidation = require('../../validations/ems/position.validation');

const router = express.Router();

router.route('/getall').get(validate(emsPositionValidation.getall), emsPositionController.getall);
router.route('/pagination').get(validate(emsPositionValidation.get), emsPositionController.pagination);
router.route('/add').post(validate(emsPositionValidation.create), emsPositionController.add);
router.route('/treenodes').get(validate(emsPositionValidation.get), emsPositionController.getTreeNodes);
router.route('/getTreeNodes').get(validate(emsPositionValidation.getTagTreeNodes), emsPositionController.getTagTreeNodes);

router
  .route('/item/:cGuid')
  .get(auth('get'), validate(emsPositionValidation.getById), emsPositionController.getById)
  .put(auth('manages'), validate(emsPositionValidation.updateById), emsPositionController.updateById)
  .delete(auth('manages'), validate(emsPositionValidation.deleteById), emsPositionController.deleteById);
module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS
 */
/**
 * @swagger
 * /api/ems/position/getall:
 *   get:
 *     summary: Get all position
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
 *                     $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/position/pagination:
 *   get:
 *     summary: Get position Pagination
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cName
 *         schema:
 *           type: string
 *         description: Thing template tag
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
 *         description: Maximum number of positions
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
 *                     $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/position/treenodes:
 *   get:
 *     summary: Get all position
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
 *                     $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/position/add:
 *   post:
 *     summary: add ems position
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_Position'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/position/item/{cGuid}:
 *   get:
 *     summary: Get a ems position by id
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
 *         description: ems position cGuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update a ems position
 *     description: update ems position item based on id
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems position cGuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_Position'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Position'
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
 *     summary: Delete a ems position
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
 *         description: ems position cGuid
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
 * /api/ems/position/getTreeNodes:
 *   get:
 *     summary: Get tag tree nodes
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
 *                     $ref: '#/components/schemas/Ems_Position'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
