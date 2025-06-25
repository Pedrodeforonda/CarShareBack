import mqtt, { MqttClient } from 'mqtt';
import { MqttService } from '../services/mqtt.service.js';
import { config } from '../config/environment.js';

export class MqttHandler {
  private mqttClient: MqttClient | null = null;
  private readonly mqttService: MqttService;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private readonly maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor() {
    this.mqttService = new MqttService();
  }

  connect(): void {
    try {
      console.log(`🔗 Connecting to MQTT broker: ${config.mqttConnectionString}`);
      
      this.mqttClient = mqtt.connect(config.mqttConnectionString, {
        keepalive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 30000,
        clean: true,
      });

      this.setupEventHandlers();
    } catch (error) {
      console.error('❌ Failed to connect to MQTT broker:', error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.mqttClient) return;

    this.mqttClient.on('connect', () => {
      console.log('✅ MQTT client connected successfully');
      this.reconnectAttempts = 0;
      this.clearReconnectInterval();
      this.subscribeToTopics();
    });

    this.mqttClient.on('error', (error) => {
      console.error('❌ MQTT connection error:', error);
      this.handleConnectionError();
    });

    this.mqttClient.on('offline', () => {
      console.log('📴 MQTT client offline');
    });

    this.mqttClient.on('reconnect', () => {
      console.log('🔄 MQTT client reconnecting...');
    });

    this.mqttClient.on('close', () => {
      console.log('🔌 MQTT client disconnected');
      this.scheduleReconnect();
    });

    this.mqttClient.on('message', (topic, message) => {
      this.handleMessage(topic, message);
    });
  }

  private subscribeToTopics(): void {
    if (!this.mqttClient) return;

    const topics = [
      'carshare/inel00/session/#',
      'carshare/inel00/01/data/#'
    ];

    topics.forEach(topic => {
      this.mqttClient!.subscribe(topic, { qos: 0 }, (error) => {
        if (error) {
          console.error(`❌ Failed to subscribe to ${topic}:`, error);
        } else {
          console.log(`📡 Subscribed to topic: ${topic}`);
        }
      });
    });
  }

  private handleMessage(topic: string, message: Buffer): void {
    const messageString = message.toString();
    console.log(`📨 Received message from ${topic}: ${messageString}`);

    try {
      switch (topic) {
        case 'carshare/inel00/session/start':
          this.handleSessionStart(messageString);
          break;
        case 'carshare/inel00/session/stop':
          this.handleSessionStop();
          break;
        case 'carshare/inel00/01/data/live':
          this.handleLiveData(messageString);
          break;
        default:
          console.log(`⚠️ Unhandled topic: ${topic}`);
      }
    } catch (error) {
      console.error(`❌ Error processing message from ${topic}:`, error);
    }
  }

  private async handleSessionStart(messageString: string): Promise<void> {
    try {
      // Parse the JSON message
      const sessionData = JSON.parse(messageString);
      const { userId, carId } = sessionData;

      // Validate userId format
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error('❌ Invalid user ID format:', userId);
        return;
      }

      // Validate carId format if provided
      if (carId && !carId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error('❌ Invalid car ID format:', carId);
        return;
      }

      console.log(`📡 Creating session for user: ${userId}${carId ? ` with car: ${carId}` : ''}`);
      await this.mqttService.createSession(userId, carId);
    } catch (error) {
      console.error('❌ Error handling session start:', error);
    }
  }

  private async handleSessionStop(): Promise<void> {
    try {
      await this.mqttService.endSession();
    } catch (error) {
      console.error('❌ Error handling session stop:', error);
    }
  }

  private async handleLiveData(data: string): Promise<void> {
    try {
      await this.mqttService.appendData(data);
    } catch (error) {
      console.error('❌ Error handling live data:', error);
    }
  }

  private handleConnectionError(): void {
    if (this.mqttClient) {
      this.mqttClient.end();
      this.mqttClient = null;
    }
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Stopping reconnection attempts.`);
      return;
    }

    if (this.reconnectInterval) return;

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
    
    console.log(`🔄 Scheduling MQTT reconnection in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectInterval = setTimeout(() => {
      this.reconnectAttempts++;
      this.clearReconnectInterval();
      this.connect();
    }, delay);
  }

  private clearReconnectInterval(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
  }

  disconnect(): void {
    console.log('🔌 Disconnecting MQTT client...');
    this.clearReconnectInterval();
    
    if (this.mqttClient) {
      this.mqttClient.end(true);
      this.mqttClient = null;
    }
    
    console.log('✅ MQTT client disconnected');
  }

  isConnected(): boolean {
    return this.mqttClient?.connected || false;
  }

  // Método para publicar mensajes MQTT
  publishMessage(topic: string, message: string): boolean {
    console.log(`🔍 Attempting to publish to ${topic}`);
    console.log(`🔍 MQTT client exists: ${!!this.mqttClient}`);
    console.log(`🔍 MQTT client connected: ${this.mqttClient?.connected}`);
    console.log(`🔍 MQTT client ready state: ${this.mqttClient?.connected ? 'connected' : 'disconnected'}`);

    if (!this.mqttClient) {
      console.error('❌ MQTT client is null. Cannot publish message.');
      return false;
    }

    if (!this.mqttClient.connected) {
      console.error('❌ MQTT client not connected. Cannot publish message.');
      console.log('🔄 Attempting to reconnect...');
      this.connect(); // Try to reconnect
      return false;
    }

    try {
      this.mqttClient.publish(topic, message, { qos: 0 }, (error) => {
        if (error) {
          console.error(`❌ Error publishing to ${topic}:`, error);
        } else {
          console.log(`📤 Message published to ${topic}: ${message}`);
        }
      });
      return true;
    } catch (error) {
      console.error(`❌ Failed to publish to ${topic}:`, error);
      return false;
    }
  }

  async getActiveSession() {
    return this.mqttService.getActiveSessionData();
  }

  // Método para verificar el estado de la conexión y sesión
  getMqttStatus() {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }

  // Métodos para simular mensajes MQTT desde endpoints HTTP
  async simulateSessionStart(userId: string, carId?: string): Promise<void> {
    console.log(`🎭 Starting session for user: ${userId}${carId ? ` with car: ${carId}` : ''}`);
    
    // 1. Crear la sesión en la base de datos
    await this.mqttService.createSession(userId, carId);
    
    // 2. Enviar comando MQTT al ESP32 para iniciar sesión
    const sessionData = {
      userId,
      carId: carId || null
    };
    
    const success = this.publishMessage(
      'carshare/inel00/session/start', 
      JSON.stringify(sessionData)
    );
    
    if (success) {
      console.log(`✅ Session start command sent to ESP32`);
    } else {
      console.error(`❌ Failed to send session start command to ESP32`);
    }
  }

  async simulateSessionStop(): Promise<void> {
    console.log(`🎭 Stopping active session`);
    
    // 1. Terminar la sesión en la base de datos
    await this.handleSessionStop();
    
    // 2. Enviar comando MQTT al ESP32 para parar sesión
    const success = this.publishMessage('carshare/inel00/session/stop', '{}');
    
    if (success) {
      console.log(`✅ Session stop command sent to ESP32`);
    } else {
      console.error(`❌ Failed to send session stop command to ESP32`);
    }
  }
}
