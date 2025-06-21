import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { sessionIdSchema } from '../validations/session.validation.js';

const router = Router();
const userController = new UserController();

/**
 * @route   GET /sessions
 * @desc    Get all inactive sessions
 * @access  Public
 */
router.get('/', userController.getAllSessions);

/**
 * @route   GET /sessions/:id
 * @desc    Get session by ID
 * @access  Public
 */
router.get('/:id', validateRequest(sessionIdSchema), userController.getSessionById);

export default router;
