import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { registerUserSchema, loginUserSchema, userIdSchema } from '../validations/user.validation.js';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerUserSchema), authController.register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateRequest(loginUserSchema), authController.login);

/**
 * @route   GET /auth/profile/:id
 * @desc    Get user profile
 * @access  Public
 */
router.get('/profile/:id', validateRequest(userIdSchema), authController.getProfile);

export default router;
