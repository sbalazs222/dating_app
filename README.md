# Dating App

A Tinder-like dating application backend built with Node.js, Express, and MySQL. This application provides a RESTful API for user authentication, profile management, and location-based matching with swipe functionality.

## Features

- **User Authentication**: Secure registration and login with JWT tokens and Argon2 password hashing
- **Location-Based Matching**: Find nearby users using geospatial queries with configurable distance limits
- **Swipe System**: Like, dislike, or superlike other users
- **Automatic Matching**: Detect mutual likes and create matches automatically
- **Gender Preferences**: Set and manage preferred gender for potential matches
- **Secure API**: Protected routes with JWT middleware and HTTP-only cookies

## Tech Stack

- **Backend**: Node.js with Express 5
- **Database**: MySQL with geospatial support
- **Authentication**: JWT (JSON Web Tokens) with cookie-based storage
- **Password Security**: Argon2 for password hashing
- **Validation**: psgutil for request validation
- **CORS**: Configured for frontend integration

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (v8.0 or higher with spatial data support)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/sbalazs222/dating_app.git
cd dating_app
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

## Database Setup

1. Create the database and tables by running the SQL script:
```bash
mysql -u your_username -p < ../database/dbinit.sql
```

This will:
- Create the `tinder_app_db` database
- Set up tables for users, swipes, and matches
- Insert sample data for testing

### Database Schema

- **users**: Stores user profiles with location data (using POINT geometry type)
- **swipes**: Records all swipe actions (like, dislike, superlike)
- **matches**: Stores mutual matches between users

## Environment Configuration

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your configuration:
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=tinder_app_db
JWT_SECRET=your_secret_jwt_key_here
```

**Important**: Use a strong, unique JWT_SECRET in production!

## Running the Application

Start the server:
```bash
cd backend
node server.js
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Authentication Routes (`/auth`)

#### Register
- **POST** `/auth/register`
- **Body**:
```json
{
  "username": "john_doe",
  "password": "securePassword123",
  "email": "john@example.com",
  "fullname": "John Doe",
  "birthdate": "1995-06-15",
  "gender": "male",
  "bio": "Love hiking and coffee",
  "latitude": 47.4979,
  "longitude": 19.0402
}
```
- **Response**: `201 Created` with success message

#### Login
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```
- **Response**: `200 OK` with JWT token set in HTTP-only cookie

#### Logout
- **POST** `/auth/logout`
- **Authentication**: Required (JWT token in cookie)
- **Response**: `200 OK` with cookie cleared

### Action Routes (`/actions`)

#### Get Swipe Candidate
- **GET** `/actions/swipe`
- **Authentication**: Required
- **Body**:
```json
{
  "distanceLimitKm": 10
}
```
- **Response**: Returns a random user within the specified distance who hasn't been swiped yet

#### Send Swipe
- **POST** `/actions/swipe`
- **Authentication**: Required
- **Body**:
```json
{
  "receiverId": 2,
  "type": "like"
}
```
- **Types**: `like`, `dislike`, `superlike`
- **Response**: `200 OK` with match notification if mutual like detected

#### Manage Preferences
- **POST** `/actions/preferences`
- **Authentication**: Required
- **Body**:
```json
{
  "preferedGender": "female"
}
```
- **Valid Values**: `male`, `female`, `all`
- **Response**: `200 OK` with preference saved in cookie

## Project Structure

```
dating_app/
├── backend/
│   ├── server.js                 # Express app entry point
│   ├── package.json              # Dependencies and scripts
│   ├── .env.example              # Environment variables template
│   └── src/
│       ├── config/
│       │   ├── dbConfig.js       # Database connection pool
│       │   └── envConfig.js      # Environment configuration
│       ├── controllers/
│       │   ├── authController.js # Authentication logic
│       │   └── actionsController.js # Swipe and match logic
│       ├── middlewares/
│       │   └── auth.js           # JWT authentication middleware
│       ├── routes/
│       │   ├── authRoutes.js     # Auth endpoint definitions
│       │   └── actionsRoutes.js  # Action endpoint definitions
│       └── util/
│           └── token.js          # JWT token utilities
└── database/
    └── dbinit.sql                # Database initialization script
```

## Security Features

- **Password Hashing**: Uses Argon2, a modern and secure password hashing algorithm
- **JWT Authentication**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **Input Validation**: All endpoints validate required fields and data types
- **SQL Injection Prevention**: Uses parameterized queries with mysql2
- **CORS Protection**: Configured to only allow requests from specified origins

## Development Notes

- The application uses ES6 modules (`type: "module"` in package.json)
- CORS is configured for frontend running on `http://localhost:5173`
- Location data uses MySQL's spatial data types (POINT) and functions
- Distance calculations use `ST_Distance_Sphere` for accurate geospatial queries
- The database uses Hungarian collation (`utf8mb4_hungarian_ci`)

## Sample Data

The database initialization script includes three sample users:
- **kovacs_bela**: Located in Budapest
- **nagy_anna**: Located in Budapest  
- **szabo_zoli**: Located in Budapest

Use these for testing the application functionality.

## Future Enhancements

Potential improvements for this project:
- Add profile photo upload functionality
- Implement real-time chat between matches
- Add user profile editing capabilities
- Create a frontend application
- Add email verification for registration
- Implement password reset functionality
- Add user blocking and reporting features
- Create admin dashboard for user management

## License

ISC

## Author

Created by sbalazs222
