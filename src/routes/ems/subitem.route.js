const express = require('express');
const emsSubItemController = require('../../controllers/ems/subitem.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emsSubItemValidation = require('../../validations/ems/subitem.validation');

const router = express.Router();

router.route('/getall').get(validate(emsSubItemValidation.getall), emsSubItemController.getall);
router.route('/pagination').get(validate(emsSubItemValidation.get), emsSubItemController.pagination);
router.route('/add').post(validate(emsSubItemValidation.create), emsSubItemController.add);

router
  .route('/item/:cGuid')
  .get(auth('get'), validate(emsSubItemValidation.getById), emsSubItemController.getById)
  .put(auth('manages'), validate(emsSubItemValidation.updateById), emsSubItemController.updateById)
  .delete(auth('manages'), validate(emsSubItemValidation.deleteById), emsSubItemController.deleteById);
router
  .route('/getTreeNodes')
  .get(auth('get'), validate(emsSubItemValidation.getTreeNodes), emsSubItemController.getTreeNodes);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS
 */
/**
 * @swagger
 * /api/ems/subitem/getall:
 *   get:
 *     summary: Get all subitem
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
 *                     $ref: '#/components/schemas/Ems_SubItem'
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
 *         description: Maximum number of subitems
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
 *                     $ref: '#/components/schemas/Ems_SubItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/subitem/add:
 *   post:
 *     summary: add ems subitem
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_SubItem'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_SubItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/subitem/item/{cGuid}:
 *   get:
 *     summary: Get a ems subitem by id
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
 *         description: ems subitem cGuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_SubItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update a ems subitem
 *     description: update ems subitem item based on id
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems subitem cGuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_SubItem'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_SubItem'
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
 *     summary: Delete a ems subitem
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
 *         description: ems subitem cGuid
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
 * /api/ems/subitem/getTreeNodes:
 *   get:
 *     summary: Get TreeNodes subitem
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
 *                     $ref: '#/components/schemas/Ems_SubItem'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
