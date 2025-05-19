# Travel Itinerary Planner

A full-stack web application for planning and managing travel itineraries. This application allows users to create trips, add accommodations, transportation details, and activities to their itineraries.

## Features

- User authentication and authorization
- Create and manage trips with start/end dates and destinations
- Add accommodations with check-in/check-out dates
- Add transportation details (flights, trains, etc.)
- Add activities for each day of the trip
- View a calendar-style itinerary of the trip
- Store all data user-wise using MongoDB Atlas

## Tech Stack

### Backend
- Node.js with Express
- MongoDB Atlas with Mongoose
- JWT for authentication
- RESTful API architecture

### Frontend
- React with Vite
- React Router for navigation
- React Hook Form for form handling
- Tailwind CSS for styling
- Axios for API requests

## Project Structure

```
travel-itinerary-planner/
├── backend/                  # Backend Node.js application
│   ├── controllers/          # Route controllers
│   ├── models/               # Mongoose models
│   ├── routes/               # Express routes
│   ├── .env.example          # Environment variables example
│   ├── package.json          # Backend dependencies
│   └── server.js             # Entry point
│
├── frontend/                 # Frontend React application
│   ├── public/               # Static files
│   ├── src/                  # Source files
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/travel-itinerary-planner.git
   cd travel-itinerary-planner
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory based on `.env.example` and add your MongoDB connection string and JWT secret.

4. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```
   cd ../frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to access the application.

## API Endpoints

### Authentication
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login a user

### Trips
- `GET /api/trips` - Get all trips for the current user
- `GET /api/trips/:id` - Get a specific trip
- `POST /api/trips` - Create a new trip
- `PATCH /api/trips/:id` - Update a trip
- `DELETE /api/trips/:id` - Delete a trip

### Accommodations
- `GET /api/accommodations` - Get all accommodations for the current user
- `GET /api/accommodations/:id` - Get a specific accommodation
- `POST /api/accommodations` - Create a new accommodation
- `PATCH /api/accommodations/:id` - Update an accommodation
- `DELETE /api/accommodations/:id` - Delete an accommodation

### Transportation
- `GET /api/transportation` - Get all transportation for the current user
- `GET /api/transportation/:id` - Get a specific transportation
- `POST /api/transportation` - Create a new transportation
- `PATCH /api/transportation/:id` - Update a transportation
- `DELETE /api/transportation/:id` - Delete a transportation

### Activities
- `GET /api/activities` - Get all activities for the current user
- `GET /api/activities/:id` - Get a specific activity
- `POST /api/activities` - Create a new activity
- `PATCH /api/activities/:id` - Update an activity
- `DELETE /api/activities/:id` - Delete an activity

## License

This project is licensed under the MIT License.
