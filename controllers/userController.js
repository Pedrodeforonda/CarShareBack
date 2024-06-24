import express from 'express';
import userService from '../services/userService.js';

const router = express.Router();
router.post('/consumption', async (req, res) => {
    try {
        const consumption = await userService.getFuelConsumption(req.body);
        res.json({ msg: 'Consumption gotten', consumption });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/sessions', async (req, res) => {
    try {
        const sessions = await userService.getAllSessions();
        res.json(sessions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/cost', async (req, res) => {
    try {
        const totalCost = await userService.getTotalCost(req.body.user);
        res.json({ msg: 'Total cost gotten', totalCost });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;