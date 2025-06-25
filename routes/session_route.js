import express from 'express'
import Session from '../models/session.js'

export const router = express.Router()

router.get("/", async (req, res) => {
    const sessions = await Session.find({ isActive: false }).populate('user', 'name email')
    res.json(sessions)
})


router.get("/:id", async (req, res) => {
    const session = await Session.findById(req.params.id).populate('user', 'name email')
    res.json(session)
})