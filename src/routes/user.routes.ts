import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { fuelConsumptionSchema, totalCostSchema, sessionIdSchema } from '../validations/session.validation.js';
import { userIdSchema } from '../validations/user.validation.js';

const router = Router();
const userController = new UserController();

/**
 * @route   POST /user/consumption
 * @desc    Calculate fuel consumption for a session
 * @access  Public
 */
router.post('/consumption', validateRequest(fuelConsumptionSchema), userController.getFuelConsumption);

/**
 * @route   GET /user/sessions
 * @desc    Get all sessions
 * @access  Public
 */
router.get('/sessions', userController.getAllSessions);

/**
 * @route   GET /user/sessions/:userId
 * @desc    Get sessions by user ID
 * @access  Public
 */
router.get('/sessions/:userId', validateRequest(userIdSchema), userController.getSessionsByUser);

/**
 * @route   GET /user/sessions/active
 * @desc    Get active session
 * @access  Public
 */
router.get('/sessions/active', userController.getActiveSession);

/**
 * @route   POST /user/cost
 * @desc    Calculate total cost for a user
 * @access  Public
 */
router.post('/cost', validateRequest(totalCostSchema), userController.getTotalCost);

export default router;
