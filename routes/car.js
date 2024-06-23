const express = require('express');
const Car = require('../models/car');
const router = express.Router();

// Crear un nuevo auto
router.post('/', async (req, res) => {
    try {
        const { model, branch, year, consumedFuel, admin, users } = req.body;
        const newCar = new Car({ model, branch, year, consumedFuel, admin, users });
        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todos los autos
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un auto
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { model, branch, year, consumedFuel, admin, users } = req.body;
        const car = await Car.findByIdAndUpdate(id, { model, branch, year, consumedFuel, admin, users }, { new: true });
        res.json(car);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un auto
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Car.findByIdAndDelete(id);
        res.json({ message: 'Car deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
