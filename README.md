# CarShare Backend API

A modern, TypeScript-based backend API for car sharing applications with MQTT integration for real-time tracking.

## Features

- 🔐 **Secure Authentication** - bcrypt password hashing, input validation
- 🚗 **Car Management** - CRUD operations for vehicles and user associations
- 📍 **Real-time Tracking** - MQTT integration for live location and session data
- 📊 **Session Analytics** - Fuel consumption and cost calculations
- 🛡️ **Security** - Rate limiting, CORS, security headers, input sanitization
- 📝 **Type Safety** - Full TypeScript implementation with strict typing
- 🔄 **Error Handling** - Centralized error management with proper HTTP status codes
- 📈 **Monitoring** - Health checks, request logging, and graceful shutdown

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 
- MQTT Broker

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd CarShareBack

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Development
npm run dev

# Production build
npm run build
npm start
```

### Environment Variables

```env
NODE_ENV=development
PORT=3001
MONGO_URL=localhost
MONGO_USER=admin
MONGO_PASS=admin
MQTT_HOST=54.235.225.241
MQTT_PORT=1883
BCRYPT_ROUNDS=12
```

## API Documentation

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepassword"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Car Management

#### Register Car
```http
POST /car
Content-Type: application/json

{
  "model": "Toyota Prius",
  "brand": "Toyota",
  "year": 2022,
  "consumedFuel": 0,
  "admin": "60d5ecb74b8c5c123456789a",
  "users": ["60d5ecb74b8c5c123456789b"]
}
```

#### Get All Users
```http
GET /car/users
```

### Session Management

#### Get All Sessions
```http
GET /sessions
```

#### Get Session by ID
```http
GET /sessions/{sessionId}
```

#### Get User Sessions
```http
GET /user/sessions/{userId}
```

#### Get Active Session
```http
GET /user/sessions/active?userId={userId}
```

### Analytics

#### Calculate Fuel Consumption
```http
POST /user/consumption
Content-Type: application/json

{
  "sessionId": "60d5ecb74b8c5c123456789c"
}
```

#### Calculate Total Cost
```http
POST /user/cost
Content-Type: application/json

{
  "user": "60d5ecb74b8c5c123456789a"
}
```

### Health Check
```http
GET /health
```

## MQTT Integration

The system subscribes to the following MQTT topics:

- `carshare/inel00/session/start` - Start a new session
- `carshare/inel00/session/stop` - End current session  
- `carshare/inel00/01/data/live` - Live location and distance data

### MQTT Message Formats

#### Session Start
```
Topic: carshare/inel00/session/start
Payload: {userId} (ObjectId string)
```

#### Session Stop
```
Topic: carshare/inel00/session/stop
Payload: (any)
```

#### Live Data
```
Topic: carshare/inel00/01/data/live
Payload: {
  "loc": {
    "lat": -33.4569,
    "lng": -70.6483
  },
  "distance": 15.7
}
```

## Response Format

All API endpoints return responses in the following format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── dtos/           # Data transfer objects
├── middlewares/    # Express middlewares
├── models/         # MongoDB models
├── mqtt/           # MQTT handler
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
├── validations/    # Input validation schemas
└── app.ts          # Application entry point
```

## Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **Input Validation**: Zod schema validation for all endpoints
- **Rate Limiting**: Configurable request rate limiting
- **CORS**: Cross-origin resource sharing protection
- **Security Headers**: Helmet.js for security headers
- **Error Handling**: No sensitive data exposure in error messages

## Monitoring

- **Health Check**: `/health` endpoint for service monitoring
- **Request Logging**: Comprehensive request/response logging
- **Error Tracking**: Detailed error logging with context
- **Graceful Shutdown**: Proper cleanup on process termination

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

[License details]
