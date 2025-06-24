import { Router } from 'express';
import { CarController } from '../controllers/car.controller.js';
import { validateRequest } from '../middlewares/validation.middleware.js';
import { registerCarSchema, carIdSchema, adminIdSchema, userIdParamSchema, deleteCarSchema } from '../validations/car.validation.js';

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
router.get('/:id', validateRequest(carIdSchema), carController.getCarById);

/**
 * @route   GET /car/admin/:adminId
 * @desc    Get cars by admin ID
 * @access  Public
 */
router.get('/admin/:adminId', validateRequest(adminIdSchema), carController.getCarsByAdmin);

/**
 * @route   GET /car/user/:userId
 * @desc    Get cars by user ID
 * @access  Public
 */
router.get('/user/:userId', validateRequest(userIdParamSchema), carController.getCarsByUser);

/**
 * @route   DELETE /car/:id
 * @desc    Delete car by ID (simple delete)
 * @access  Public
 */
router.delete('/:id', validateRequest(carIdSchema), carController.deleteCar);

/**
 * @route   DELETE /car/:id/admin
 * @desc    Delete car by ID with admin verification
 * @access  Public
 */
router.delete('/:id/admin', validateRequest(deleteCarSchema), carController.deleteCarWithAdmin);

export default router;
