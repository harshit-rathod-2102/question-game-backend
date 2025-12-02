# MathQuest Game - Backend

A NestJS backend for the MathQuest math quiz game with MongoDB storage and JWT authentication.

## Features

- **User Registration** with validation for:
  - First Name (required, min 2 characters)
  - Last Name (required, min 2 characters)
  - Email (required, valid email format)
  - Profile Picture URL (optional)
  - Birthdate (required, must be at least 13 years old)
  - Phone Number (required, valid phone format)
  - Password (required, min 8 chars, must contain uppercase, lowercase, and number)

- **User Authentication** with JWT tokens
- **MongoDB** for data storage
- **Input Validation** using class-validator

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/math-quest-game
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=7d
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "profilePicture": "https://example.com/avatar.jpg",
  "birthdate": "1990-01-15",
  "phoneNumber": "+1234567890",
  "password": "Password123"
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User (Protected)
```
GET /auth/me
Authorization: Bearer <token>
```

#### Logout (Protected)
```
POST /auth/logout
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-id-here"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "firstName": "John",
      "lastName": "Doe",
      "name": "John Doe",
      "email": "john@example.com",
      "profilePicture": "...",
      "birthdate": "1990-01-15T00:00:00.000Z",
      "phoneNumber": "+1234567890",
      "role": "player",
      "permissions": [],
      "isVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email address"
      }
    ],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── local-auth.guard.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── common/
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## License

MIT

