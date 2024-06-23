import Session from "../models/session.js";

const getFuelConsumption = async (sessionId) => {
    const session = await Session.findById(sessionId)

    if (!session) {
        throw new Error('Session not found');
    }

    const carConsumption = session.car.consumedFuel;
    const distance = session.distance;

    return (distance / carConsumption) * 1013;
}

const getAllSessions = async () => {
    return Session.find(undefined, undefined, undefined);
}

export default { getFuelConsumption, getAllSessions };