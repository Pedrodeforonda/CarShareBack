import express from 'express';
import authService from '../services/authService.js';

const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.json({ msg: 'User registered successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await authService.login(req.body);
        res.json({ msg: 'User logged in successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;