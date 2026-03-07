# SkillBridge – Volunteer & NGO Collaboration Platform

SkillBridge is a full-stack web application that connects volunteers with NGOs based on skills, interests, and opportunities. The platform enables volunteers to discover meaningful opportunities and allows NGOs to post and manage volunteer requirements efficiently.

---

## Project Overview

SkillBridge bridges the gap between skilled volunteers and NGOs by providing a centralized platform for collaboration. Volunteers can create profiles, showcase skills, and apply for opportunities, while NGOs can create opportunities, review applications, and communicate with volunteers.

This project was developed as part of the Infosys Springboard Full Stack Milestone.

---

## Features

### Authentication
- User registration (Volunteer / NGO)
- Secure login using JWT authentication
- Role-based user profiles

### Volunteer Features
- Create and manage profile
- Add skills and bio
- Browse opportunities
- Apply for NGO opportunities
- View application status
- Real-time messaging with NGOs

### NGO Features
- Create organization profile
- Post volunteer opportunities
- Manage applications (accept/reject)
- View volunteer profiles
- Real-time messaging with volunteers

### Dashboard
- Personalized dashboard (role-specific)
- Application statistics
- Opportunity management
- Skills overview
- Real-time notifications

### Additional Features
- Real-time messaging (Socket.IO)
- Real-time notifications
- Browse & filter opportunities
- Match suggestions based on skills

---

## Tech Stack

### Frontend
- React.js (Vite)
- JavaScript
- CSS
- React Router DOM
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Socket.IO
- Express Validator

---

## Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Required |
|----------|---------|----------|
| Node.js | 14+ | ✅ Yes |
| npm | 6+ | ✅ Yes |
| MongoDB | 4+ | ✅ Yes (local or Atlas) |
| Git | Any | Optional |

---

## Project Structure

```
SkillBridge-feb-team03/
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   ├── BrowseOpportunities.jsx
│   │   │   ├── OpportunityCreate.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── MyOpportunities.jsx
│   │   │   ├── Messages.jsx
│   │   │   └── Notifications.jsx
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── MatchSuggestions.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   └── NotificationSystem.jsx
│   │   ├── services/           # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── opportunityService.js
│   │   │   ├── applicationService.js
│   │   │   ├── conversationService.js
│   │   │   ├── messageService.js
│   │   │   ├── matchingService.js
│   │   │   ├── notificationService.js
│   │   │   └── socketService.js
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── routes/             # Routing
│   │   │   └── AppRoutes.jsx
│   │   ├── styles/             # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Express Backend
│   ├── controllers/            # Route controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── opportunityController.js
│   │   ├── applicationController.js
│   │   ├── conversationController.js
│   │   ├── messageController.js
│   │   ├── matchingController.js
│   │   └── notificationController.js
│   ├── models/                # Mongoose models
│   │   ├── user.js
│   │   ├── opportunity.js
│   │   ├── application.js
│   │   ├── conversation.js
│   │   ├── message.js
│   │   ├── notification.js
│   │   └── user.js
│   ├── routes/                 # Express routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── matchingRoutes.js
│   │   └── notificationRoutes.js
│   ├── middleware/             # Custom middleware
│   │   └── authMiddleware.js
│   ├── config/                 # Configuration
│   │   └── db.js
│   ├── server.js               # Entry point
│   └── package.json
│
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03.git
cd SkillBridge-feb-team03
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
# Option A: Local MongoDB
MONGO_URI=mongodb://localhost:27017/skillbridge

# Option B: MongoDB Atlas (Cloud)
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/skillbridge

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

Start the backend server:

```bash
# Development mode (with auto-restart)
npm run dev

# OR Production mode
npm start
```

Backend will run on: **http://localhost:5000**

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## Running the Application

### Development Mode

1. **Start MongoDB** (if using local):
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   mongod
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

4. Open browser and navigate to: **http://localhost:5173**

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/skillbridge |
| JWT_SECRET | JWT signing secret | any_secure_random_string |
| JWT_EXPIRE | Token expiration time | 7d |

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Get user profile | ✅ |
| PUT | `/api/users/me` | Update user profile | ✅ |

### Opportunities

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/opportunities` | Get all opportunities | ❌ |
| GET | `/api/opportunities/:id` | Get single opportunity | ❌ |
| GET | `/api/opportunities/my` | Get NGO's opportunities | ✅ (NGO) |
| POST | `/api/opportunities` | Create opportunity | ✅ (NGO) |
| PUT | `/api/opportunities/:id` | Update opportunity | ✅ (NGO Owner) |
| DELETE | `/api/opportunities/:id` | Delete opportunity | ✅ (NGO Owner) |

### Applications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/applications` | Get user's applications | ✅ |
| GET | `/api/applications/opportunity/:id` | Get applications for opportunity | ✅ (NGO) |
| POST | `/api/applications` | Submit application | ✅ (Volunteer) |
| PUT | `/api/applications/:id/status` | Update application status | ✅ (NGO) |

### Conversations

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/conversations` | Get user's conversations | ✅ |
| POST | `/api/conversations` | Create conversation | ✅ |
| GET | `/api/conversations/:id` | Get single conversation | ✅ |

### Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/messages/conversation/:conversationId` | Get conversation messages | ✅ |
| POST | `/api/messages` | Send message | ✅ |
| PUT | `/api/messages/conversation/:conversationId/read` | Mark as read | ✅ |

### Matching

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/matching/opportunities` | Get matched opportunities | ✅ |
| GET | `/api/matching/volunteers` | Get matched volunteers | ✅ (NGO) |

### Notifications

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notifications` | Get notifications | ✅ |
| GET | `/api/notifications/unread` | Get unread count | ✅ |
| PUT | `/api/notifications/:id/read` | Mark as read | ✅ |
| PUT | `/api/notifications/read-all` | Mark all as read | ✅ |
| DELETE | `/api/notifications/:id` | Delete notification | ✅ |

---

## Usage Guide

### For Volunteers

1. **Register** as a volunteer
2. **Login** to your account
3. **Edit Profile** - Add your skills, bio, and location
4. **Browse Opportunities** - View available NGO opportunities
5. **Apply** - Submit applications to opportunities
6. **Track Applications** - View status (pending/accepted/rejected)
7. **Messages** - Chat with NGOs after application is accepted

### For NGOs

1. **Register** as an NGO
2. **Login** to your account
3. **Edit Profile** - Add organization details
4. **Create Opportunities** - Post volunteer requirements
5. **Manage Applications** - Review and accept/reject volunteers
6. **Messages** - Communicate with applicants/volunteers

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Make sure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGO_URI` in `.env` is correct

**2. CORS Errors**
- Ensure backend runs on port 5000
- Frontend should run on port 5173

**3. Socket.IO Connection Issues**
- Check that no firewall is blocking the ports
- Verify the CORS origin in `server.js` matches frontend URL

**4. JWT Token Issues**
- Clear browser localStorage and login again
- Verify `JWT_SECRET` is set in `.env`

### Running in Production

For production deployment:

1. Build frontend: `cd frontend && npm run build`
2. Serve static files from Express
3. Use environment variables for production database

---

## Milestone Completion

### Milestone 1 - COMPLETE ✅
- User Registration
- User Login
- JWT Authentication
- Profile Creation
- Protected Routes
- Frontend UI
- Backend API Integration

### Milestone 2 - COMPLETE ✅
- Opportunity CRUD (for NGOs)
- Profile Editing
- Role-based Access Control
- Enhanced Dashboard
- Application Tracking

### Milestone 3 - COMPLETE ✅
- Real-time Messaging (Socket.IO)
- Real-time Notifications
- Application Management
- Match Suggestions
- Browse & Filter Opportunities

---

## Future Improvements

- Rating & Reviews System
- Dashboard Analytics
- Email Notifications
- File Upload (resumes, images)
- Advanced Search & Filters
- Mobile App
- Deployment (Render/Vercel)

---

## License

This project is created for educational and internship purposes.

---

## Author

**Aman Kumar**  
Infosys Springboard Internship Project

---

## Acknowledgments

- Infosys Springboard
- MongoDB
- Socket.IO
- React Community

