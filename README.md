# ZenSkills - AI Driven Mentorship Platform

A comprehensive mentorship platform connecting mentors and mentees through interactive sessions, workshops, and community engagement.

## Features

- **User Management**
  - Role-based authentication (Mentors, Mentees, Admins)
  - Profile management with skill tracking
  - Email verification system

- **Mentorship Features**
  - Session scheduling and booking
  - Workshop creation and management
  - Interactive calendar for availability
  - AI-powered mentor recommendations
  - Progress tracking and milestones

- **Communication Tools**
  - Real-time chat functionality
  - Video meetings integration
  - Community discussion forums
  - Notification system

- **Career Development**
  - Job board with application system
  - Skill assessment tools
  - Workshop participation
  - Achievement tracking

- **Analytics & Insights**
  - Mentor statistics dashboard
  - Session analytics
  - Progress tracking
  - Performance metrics

## Tech Stack

### Frontend
- React 18.x
- Vite
- Material-UI
- Chart.js/Recharts for analytics
- WebSocket for real-time features
- VideoSDK for video meetings

### Backend
- Node.js with Express
- Prisma ORM
- PostgreSQL database
- Google's Generative AI integration
- JWT authentication
- WebSocket server

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd zenskills
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:

Create `.env` files in both frontend and backend directories:

Backend `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/zenskills"
JWT_SECRET=your_jwt_secret
GOOGLE_AI_API_KEY=your_api_key
EMAIL_SERVICE_KEY=your_email_service_key
```

Frontend `.env`:
```env
VITE_API_URL=http://localhost:3000
VITE_WEBSOCKET_URL=ws://localhost:3000
```

4. Initialize the database:
```bash
cd backend
npx prisma migrate dev
npm run seed
```

## Development

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Available Scripts

Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

Backend:
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed the database with initial data

## Project Structure

```
zenskills/
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── apis/         # API integration
│   │   ├── styles/       # CSS/SCSS styles
│   │   └── misc/         # Utilities and helpers
│   └── public/           # Static assets
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   ├── services/        # Business logic
│   └── prisma/          # Database schema and migrations
```

## Environment Variables

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `GOOGLE_AI_API_KEY`: Google AI API credentials
- `EMAIL_SERVICE_KEY`: Email service credentials
- `PORT`: Server port (default: 3000)

### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_WEBSOCKET_URL`: WebSocket server URL

## License

This project is licensed under the MIT License - see the LICENSE file for details.
