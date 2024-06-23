import Session from '../models/session.js'
import Location from '../models/location.js'

export const createSession = async () => {
    await Session.findOneAndUpdate(
        { isActive: true },
        { $set: { isActive: false } },
        { new: false },
    )

    const newSession = new Session()
    await newSession.save()
}

export const endSession = async () => {
    await Session.findOneAndUpdate(
        { isActive: true },
        { $set: { isActive: false, end_time: new Date() } },
        { new: false },
    )
}

export const appendData = async (dataJson) => {
    const data = JSON.parse(dataJson)
    const session = await Session.findOne({ isActive: true }).exec()

    const location = Location({ latitude: data.loc.lat, longitude: data.loc.lng })

    if (!session) throw new Error('No active Session')

    session.location.push(location)
    session.distance = data.distance

    await session.save()
}