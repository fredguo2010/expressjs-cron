const express = require('express');
const emsSubsituteController = require('../../controllers/ems/subsitute.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const emsSubsituteValidation = require('../../validations/ems/subsitute.validation');
const multerConfig = require('../../core/multer'); // Import the module

const router = express.Router();
router
  .route('/coverpicture/upload')
  .post(auth('manages'), multerConfig.subsitutestorage.single('coverpicture'), emsSubsituteController.uploadCoverPicture);
router.route('/getall').get(validate(emsSubsituteValidation.getall), emsSubsituteController.getall);
router.route('/pagination').get(validate(emsSubsituteValidation.getEmsSubsitute), emsSubsituteController.pagination);
router.route('/add').post(validate(emsSubsituteValidation.createEmsSubsitute), emsSubsituteController.addEmsSubsitute);
router
  .route('/item/:cGuid')
  .get(auth('get'), validate(emsSubsituteValidation.getEmsSubsituteById), emsSubsituteController.getEmsSubsituteById)
  .put(auth('manages'), validate(emsSubsituteValidation.updateById), emsSubsituteController.updateById)
  .delete(auth('manages'), validate(emsSubsituteValidation.deleteById), emsSubsituteController.deleteById);

router
  .route('/getTreeNodes')
  .get(auth('get'), validate(emsSubsituteValidation.getTreeNodes), emsSubsituteController.getTreeNodes);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: EMS
 *   description: EMS
 */
/**
 * @swagger
 * /api/ems/subsitute/getall:
 *   get:
 *     summary: Get all subsitutes
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
 *                     $ref: '#/components/schemas/Ems_Subsitute'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
/**
 * @swagger
 * /api/ems/subsitute/pagination:
 *   get:
 *     summary: Get subsitutes Pagination
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
 *         description: Maximum number of subsitutes
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
 *                     $ref: '#/components/schemas/Ems_Subsitute'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/subsitute/add:
 *   post:
 *     summary: add ems subsitute
 *     description:
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_Subsitute'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Subsitute'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /api/ems/subsitute/item/{cGuid}:
 *   get:
 *     summary: Get a ems subsitute by id
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
 *         description: ems subsitute cGuid
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Subsitute'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     summary: Update a ems subsitute
 *     description: update ems subsitute item based on id
 *     tags: [EMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cGuid
 *         required: true
 *         schema:
 *           type: string
 *         description: ems subsitute cGuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ems_Subsitute'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Ems_Subsitute'
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
 *     summary: Delete a ems subsitute
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
 *         description: ems subsitute cGuid
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
 * /api/ems/subsitute/getTreeNodes:
 *   get:
 *     summary: Get TreeNodes subsitutes
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
 *                     $ref: '#/components/schemas/Ems_Subsitute'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */
