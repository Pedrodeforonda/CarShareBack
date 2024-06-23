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

export default router;