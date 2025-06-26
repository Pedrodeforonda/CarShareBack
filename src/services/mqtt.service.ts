import Session from '../models/session.model.js';
import Location from '../models/location.model.js';
import { MqttLiveData, ISession } from '../types/models.js';
import { AppError } from '../utils/errors.js';

export class MqttService {
  async createSession(userId: string, carId?: string): Promise<void> {
    try {
      // End any existing active sessions for all users
      await Session.updateMany(
        { isActive: true },
        { $set: { isActive: false, end_time: new Date() } }
      );

      // Create new session
      const newSession = new Session({
        user: userId,
        car: carId, // Asociar el auto si se proporciona
        isActive: true,
      });

      await newSession.save();
      console.log(`✅ Session created for user: ${userId}${carId ? ` with car: ${carId}` : ''}`);
    } catch (error) {
      console.error('❌ Error creating session:', error);
      throw new AppError('Failed to create session');
    }
  }

  async endSession(): Promise<void> {
    try {
      const result = await Session.findOneAndUpdate(
        { isActive: true },
        { $set: { isActive: false, end_time: new Date() } },
        { new: true }
      );

      if (result) {
        console.log(`✅ Session ended for user: ${result.user}`);
      } else {
        console.log('⚠️ No active session found to end');
      }
    } catch (error) {
      console.error('❌ Error ending session:', error);
      throw new AppError('Failed to end session');
    }
  }

  async appendData(dataJson: string): Promise<void> {
    try {
      const data: any = JSON.parse(dataJson);
      // Accept both string and number for lat/lng/distance
      let lat = data.loc && (typeof data.loc.lat === 'string' ? parseFloat(data.loc.lat) : data.loc.lat);
      let lng = data.loc && (typeof data.loc.lng === 'string' ? parseFloat(data.loc.lng) : data.loc.lng);
      let distance = typeof data.distance === 'string' ? parseFloat(data.distance) : data.distance;

      // Validate data structure
      if (!data.loc || typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) {
        throw new AppError('Invalid location data format');
      }
      if (typeof distance !== 'number' || isNaN(distance) || distance < 0) {
        throw new AppError('Invalid distance data');
      }

      const session = await Session.findOne({ isActive: true });
      if (!session) {
        console.log('⚠️ No active session found for data append');
        return;
      }

      const location = new Location({ 
        latitude: lat, 
        longitude: lng 
      });

      // Validate location coordinates
      if (Math.abs(location.latitude) > 90 || Math.abs(location.longitude) > 180) {
        throw new AppError('Invalid GPS coordinates');
      }

      session.location.push(location);
      session.distance = distance;
      await session.save();
      console.log(`📍 Data appended to session: ${session._id}, Distance: ${distance}km`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('❌ Invalid JSON data:', dataJson);
        throw new AppError('Invalid JSON format');
      }
      console.error('❌ Error appending data:', error);
      throw error instanceof AppError ? error : new AppError('Failed to append session data');
    }
  }

  async getActiveSessionData(): Promise<(ISession & { _id: any }) | null> {
    try {
      return await Session.findOne({ isActive: true })
        .populate('user', 'name email')
        .populate('car', 'model brand year');
    } catch (error) {
      console.error('❌ Error getting active session:', error);
      throw new AppError('Failed to get active session data');
    }
  }
}
