import express from 'express';
import gameController from '../../controllers/game.controller.js';
import { auth } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import { PERMISSION_ENUM } from '../../shared/config/roles.js';
import gameValidation from '../../validations/game.validation.js';

const router = express.Router();

router
  .route('/')
  .get(auth([PERMISSION_ENUM.GET_GAME]), validate(gameValidation.queryGames), gameController.queryGames)
  .post(auth([PERMISSION_ENUM.CREATE_GAME]), validate(gameValidation.createGame), gameController.createGame);

router
  .route('/:gameId')
  .get(auth([PERMISSION_ENUM.GET_GAME]), validate(gameValidation.queryGame), gameController.queryOneGame)
  .patch(auth([PERMISSION_ENUM.UPDATE_GAME]), validate(gameValidation.updateGame), gameController.updateGame)
  .delete(auth([PERMISSION_ENUM.DELETE_GAME]), validate(gameValidation.deleteGame), gameController.deleteGame);

export default router;

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Game management and retrieval
 */

/**
 * @swagger
 * /game:
 *   post:
 *     summary: Create new game. Only admin can do this action.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ['featured', 'popular', 'game-credits', 'gift-cards', 'games', 'services', 'newly-added', 'direct-top-up']
 *               genre:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ['others','action','adventure','casual','mmo','moba','rpg','shooter','simulation','social','sports','strategy']
 *               platform:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: ['desktop', 'mobile', 'console']
 *               thumbnail:
 *                 type: string
 *             example:
 *               name: 'World of Warships (SEA)'
 *               category: ['games']
 *               genre: ['mmo', 'shooter']
 *               platform: ['desktop']
 *               thumbnail: https://media.gold.razer.com/goldweb/content/catalogs/gold/aces-of-the-luftwaffe---squadron/attachment/GUYTE6BVGEZC2YLDMVZS233GFVWHKZTUO5QWMZTF.png
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Game'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all games
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Game name
 *       - in: query
 *         name: category
 *         description: Game category
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['featured', 'popular', 'game-credits', 'gift-cards', 'games', 'services', 'newly-added', 'direct-top-up']
 *       - in: query
 *         name: genre
 *         description: Game genre
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['others','action','adventure','casual','mmo','moba','rpg','shooter','simulation','social','sports','strategy']
 *       - in: query
 *         name: platform
 *         description: Game platform
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['desktop', 'mobile', 'console']
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of game per page
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Game'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "400":
 *         $ref: '#/components/responses/DuplicateGameName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /game/{gameId}:
 *   get:
 *     summary: Get a game
 *     description: Get information of a game by gameId.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Game'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a game
 *     description: Update a game by gameId. Only admin can do this action.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: array
 *                 enum: ['featured', 'popular', 'game-credits', 'gift-cards', 'games', 'services', 'newly-added', 'direct-top-up']
 *               genre:
 *                 type: array
 *                 enum: ['others','action','adventure','casual','mmo','moba','rpg','shooter','simulation','social','sports','strategy']
 *               platform:
 *                 type: array
 *                 enum: ['desktop', 'mobile', 'console']
 *               thumbnail:
 *                 type: string
 *             example:
 *               name: 'World of Warships (SEA)'
 *               category: ['games']
 *               genre: ['mmo', 'shooter']
 *               platform: ['desktop']
 *               thumbnail: https://media.gold.razer.com/goldweb/content/catalogs/gold/aces-of-the-luftwaffe---squadron/attachment/GUYTE6BVGEZC2YLDMVZS233GFVWHKZTUO5QWMZTF.png
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Game'
 *       "400":
 *         $ref: '#/components/responses/DuplicateGameName'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a game
 *     description: Delete a game by gameId. Only admin can do this action.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: Game id
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
