import express from 'express';
import carService from '../services/carService.js';

const router = express.Router();
router.post('/car', async (req, res) => {
    try {
        const car = await carService.registerCar(req.body);
        res.json({ msg: 'Car registered successfully', car });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await carService.findUsers(); // Get all users
        res.json(users); // Send the users as a response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



export default router;