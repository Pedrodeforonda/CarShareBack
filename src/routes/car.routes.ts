import { Router } from 'express';
import { CarController } from '../controllers/car.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { registerCarSchema } from '../validations/car.validation.js';
import { userIdSchema } from '../validations/user.validation.js';

const router = Router();
const carController = new CarController();

/**
 * @route   POST /car
 * @desc    Register a new car
 * @access  Public
 */
router.post('/', validateRequest(registerCarSchema), carController.registerCar);

/**
 * @route   GET /car/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/users', carController.getAllUsers);

/**
 * @route   GET /car/:id
 * @desc    Get car by ID
 * @access  Public
 */
router.get('/:id', validateRequest(userIdSchema), carController.getCarById);

/**
 * @route   GET /car/admin/:adminId
 * @desc    Get cars by admin ID
 * @access  Public
 */
router.get('/admin/:adminId', validateRequest(userIdSchema), carController.getCarsByAdmin);

/**
 * @route   GET /car/user/:userId
 * @desc    Get cars by user ID
 * @access  Public
 */
router.get('/user/:userId', validateRequest(userIdSchema), carController.getCarsByUser);

export default router;
