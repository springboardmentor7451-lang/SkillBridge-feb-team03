# SkillBridge – Volunteer & NGO Collaboration Platform

<div align="center">

**SkillBridge** is a comprehensive full-stack web application that connects volunteers with NGOs based on skills, interests, and opportunities. The platform enables seamless collaboration between volunteers seeking meaningful work and organizations looking for skilled volunteers.

[Live Demo](#) • [Documentation](#api-documentation) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Command Reference](#-command-reference)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

SkillBridge bridges the gap between skilled volunteers and NGOs by providing a centralized platform for meaningful collaboration.

### For Volunteers:
- ✅ Create comprehensive profiles with skills, experience, and profile pictures
- ✅ Browse available opportunities from various NGOs  
- ✅ Apply for opportunities that match your interests
- ✅ Rate and review NGOs after completing opportunities
- ✅ Receive real-time notifications about opportunities and applications
- ✅ Direct messaging with NGOs for inquiries
- ✅ View personalized skill match recommendations

### For NGOs:
- ✅ Create and manage volunteer opportunities
- ✅ Browse volunteer profiles and find ideal candidates
- ✅ View and manage volunteer applications (accept/reject)
- ✅ Rate and review volunteers after project completion
- ✅ Real-time messaging with interested volunteers
- ✅ Track volunteer-opportunity matches and recommendations
- ✅ Manage organization profile and contact information

**Development Context:**
This project was developed as part of the **Infosys Springboard Full Stack Milestone** by a team of 3 developers, demonstrating full-stack capabilities including user authentication, real-time communication, database design, and responsive UI/UX.

---

## ✨ Features

### Authentication & Security
- User registration (Volunteer / NGO roles)
- Secure JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Protected routes and endpoints

### User Management
- Comprehensive profile creation for both roles
- Profile picture upload support
- Bio and skills management
- Organization details for NGOs
- Editable user profiles
- User dashboard with statistics

### Opportunity Management
- Create and manage volunteer opportunities
- Detailed opportunity descriptions with requirements
- Search and filter opportunities
- Opportunity status tracking (open/closed)
- Application management interface
- Opportunity browsing with ratings

### Real-Time Features
- Socket.IO powered live messaging
- Real-time notifications
- Instant conversation creation
- Live application updates
- Real-time matching suggestions

### Ratings & Reviews
- Rate volunteers and NGOs
- Review system with comments
- Average rating calculations
- Rating history tracking
- Ratings prominently displayed in profiles

### Theming System
- 5 beautiful color themes (Light, Blue Gray, Sunset, Rainforest, Ocean)
- CSS variable-based theme switching
- Persistent theme selection using next-themes
- Smooth theme transitions

### Additional Features
- Personalized skill-based matching
- Real-time notifications system
- Responsive design (mobile, tablet, desktop)
- Contact section with creator information
- Loading states and error handling
- Toast notifications for user feedback

---

## 🛠 Tech Stack

### Frontend
- **React.js 18** - UI framework
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js Themes** - Theme management and persistence
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time server communication
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration
- **Nodemon** - Auto-restart during development

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **Postman** - API testing (optional)

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **Node.js** | 14+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 6+ | Package manager (included with Node.js) | Included with Node.js |
| **MongoDB** | 4+ | Database | [Local](https://www.mongodb.com/try/download/community) or [Atlas Cloud](https://www.mongodb.com/cloud/atlas) |
| **Git** | Any | Version control (optional) | [git-scm.com](https://git-scm.com/) |

**Verify Installation:**

```bash
node --version          # Should show v14 or higher
npm --version           # Should show 6 or higher
mongod --version        # Should show MongoDB version (if installed locally)
git --version           # Optional, for cloning
```

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

**Using Git:**
```bash
git clone https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03.git
cd SkillBridge-feb-team03
```

**Or Download as ZIP:**
1. Visit: https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03
2. Click green "Code" button → "Download ZIP"
3. Extract the ZIP file
4. Open terminal and navigate to the extracted folder

---

### Step 2: Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

**Packages Installed:**

| Package | Purpose |
|---------|---------|
| express | Web server framework |
| mongoose | MongoDB database ORM |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password encryption |
| socket.io | Real-time communication |
| dotenv | Environment variables |
| cors | Cross-origin requests |
| express-validator | Input validation |
| nodemon (dev) | Auto-restart server |

**Create `.env` file in `backend` folder:**

```env
# SERVER CONFIGURATION
PORT=5000
NODE_ENV=development

# DATABASE CONNECTION
# Option A: Local MongoDB
MONGO_URI=mongodb://localhost:27017/skillbridge

# Option B: MongoDB Atlas (Cloud - recommended)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge

# JWT CONFIGURATION  
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# FRONTEND URL (for CORS)
FRONTEND_URL=http://localhost:5173

# SOCKET CONFIGURATION
SOCKET_PORT=3001
```

**Notes:**
- Replace `username` and `password` in MONGO_URI with your actual MongoDB Atlas credentials
- Keep JWT_SECRET secret - use a strong random string
- For production, never commit `.env` files to GitHub

**Start the backend:**

```bash
npm run dev
```

Expected output:
```
listening on port 5000
MongoDB connected successfully
```

✅ Backend running at **http://localhost:5000**

---

### Step 3: MongoDB Setup

#### Option A: Local MongoDB (Windows/Mac/Linux)

**Windows:**
```bash
# Command Prompt (as Administrator)
net start MongoDB

# OR start manually:
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

**Mac:**
```bash
# Using Homebrew (if installed)
brew services start mongodb-community

# OR manually:
mongod
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
```

MongoDB will run on: `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud) - Recommended

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string from "Connect" button
5. Replace `MONGO_URI` in `.env` file with your connection string

Example: `mongodb+srv://yourUsername:yourPassword@cluster0.xyz.mongodb.net/skillbridge`

---

### Step 4: Frontend Setup

Open a **new terminal** (keep backend running), then:

```bash
cd frontend
npm install
```

**Packages Installed:**

| Package | Purpose |
|---------|---------|
| react | UI library |
| react-router-dom | Routing |
| axios | HTTP requests |
| socket.io-client | Real-time client |
| tailwindcss | CSS framework |
| next-themes | Theme management |
| @radix-ui/* | UI components |
| lucide-react | Icons |
| sonner | Notifications |
| framer-motion | Animations |
| vite | Build tool |

**Start the frontend:**

```bash
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ Frontend running at **http://localhost:5173**

---

## 📱 Running the Application

### Complete First-Time Setup Guide

**Open 3 Terminals:**

#### Terminal 1: Start MongoDB
```bash
# Windows
net start MongoDB

# Mac
mongod

# Linux
sudo systemctl start mongod
```

Wait for message: `MongoDB listening on port 27017`

#### Terminal 2: Start Backend
```bash
cd SkillBridge-feb-team03/backend
npm install   # First time only
npm run dev
```

Wait for message: `listening on port 5000`

#### Terminal 3: Start Frontend
```bash
cd SkillBridge-feb-team03/frontend
npm install   # First time only
npm run dev
```

Wait for message: `Local: http://localhost:5173/`

### Open in Browser
- Navigate to **http://localhost:5173**
- You should see the SkillBridge homepage

### Test the Application
1. **Register** as a Volunteer or NGO
2. **Complete** your profile
3. **Browse** opportunities (volunteers) or volunteers (NGOs)
4. **Message** other users
5. **Apply** for opportunities or rate volunteers

---

## 📁 Project Structure

```
SkillBridge-feb-team03/
│
├── frontend/                         # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/                   # Page components (routes)
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Register.jsx         # Signup form (volunteer/NGO)
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── Profile.jsx          # User profile view
│   │   │   ├── ProfileEdit.jsx      # Edit user profile
│   │   │   ├── BrowseOpportunities.jsx  # Browse opportunities
│   │   │   ├── OpportunityCreate.jsx    # Create opportunity
│   │   │   ├── Applications.jsx     # View applications
│   │   │   ├── MyOpportunities.jsx  # Manage opportunities
│   │   │   ├── Messages.jsx         # Real-time messaging
│   │   │   ├── Notifications.jsx    # Notification center
│   │   │   └── Matches.jsx          # Skill-based matches
│   │   │
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── Sidebar.jsx          # Sidebar navigation
│   │   │   ├── Footer.jsx           # Footer with contact
│   │   │   ├── ApplicationForm.jsx  # Reusable form
│   │   │   ├── MatchSuggestions.jsx # Match suggestions
│   │   │   ├── NotificationBell.jsx # Notification icon
│   │   │   ├── NotificationSystem.jsx
│   │   │   ├── ThemeSelector.jsx    # Theme switcher
│   │   │   └── ui/                  # Radix UI components
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── input.jsx
│   │   │       ├── tabs.jsx
│   │   │       └── tooltip.jsx
│   │   │
│   │   ├── services/                # API service layer
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js      # Auth API calls
│   │   │   ├── userService.js      # User API calls
│   │   │   ├── opportunityService.js
│   │   │   ├── applicationService.js
│   │   │   ├── conversationService.js  # Messaging
│   │   │   ├── messageService.js
│   │   │   ├── matchingService.js
│   │   │   ├── notificationService.js
│   │   │   └── socketService.js    # Socket.io client
│   │   │
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.jsx      # Auth state
│   │   │   └── SocketContext.jsx    # Socket.io state
│   │   │
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx        # Route definitions
│   │   │
│   │   ├── styles/                  # CSS files
│   │   │   ├── home.css
│   │   │   ├── login.css
│   │   │   ├── navbar.css
│   │   │   └── register.css
│   │   │
│   │   ├── App.jsx                  # Root component
│   │   ├── index.css                # Global styles & themes
│   │   └── main.jsx                 # Entry point
│   │
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   └── index.html                   # HTML entry
│
│
├── backend/                         # Express Backend
│   ├── controllers/                # Business logic
│   │   ├── authController.js      # Auth logic
│   │   ├── userController.js      # User management
│   │   ├── opportunityController.js
│   │   ├── applicationController.js
│   │   ├── conversationController.js  # Messaging logic
│   │   ├── messageController.js
│   │   ├── matchingController.js  # Skill matching
│   │   └── notificationController.js
│   │
│   ├── models/                    # Mongoose schemas
│   │   ├── user.js               # User schema
│   │   ├── opportunity.js        # Opportunity schema
│   │   ├── application.js        # Application schema
│   │   ├── conversation.js       # Conversation schema
│   │   ├── message.js            # Message schema
│   │   ├── notification.js       # Notification schema
│   │   └── rating.js             # Rating schema
│   │
│   ├── routes/                    # Express routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── opportunityRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── matchingRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── middleware/                # Custom middleware
│   │   └── authMiddleware.js     # JWT verification
│   │
│   ├── config/                    # Configuration
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── server.js                  # Express app setup
│   ├── package.json              # Backend dependencies
│   └── .env                       # Environment variables
│
├── README.md                        # This file
└── .gitignore
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashedpassword",
  "role": "volunteer",    // or "ngo"
  "profilePictureUrl": "https://example.com/image.jpg"
}
```

#### Login  
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "hashedpassword"
}
```

### User Endpoints

#### Get Current User
```bash
GET /api/users/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```bash
PUT /api/users/me
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "profilePictureUrl": "new-url",
  "skills": ["skill1", "skill2"],
  "bio": "Updated bio"
}
```

### Opportunity Endpoints

#### Create Opportunity (NGO only)
```bash
POST /api/opportunities
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Community Service",
  "description": "Help with community development",
  "requirements": ["leadership", "communication"],
  "startDate": "2024-05-01",
  "endDate": "2024-06-01"
}
```

#### Get All Opportunities
```bash
GET /api/opportunities
```

#### Get Single Opportunity
```bash
GET /api/opportunities/:id
```

### Application Endpoints

#### Create Application
```bash
POST /api/applications
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "opportunityId": "opp_id_123",
  "message": "I'm interested in this opportunity"
}
```

### Messaging Endpoints

#### Create/Get Direct Conversation
```bash
POST /api/conversations/direct
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "participantId": "user_id_123"
}
```

#### Send Message
```bash
POST /api/messages
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "conversationId": "conv_id_123",
  "text": "Hello, I'm interested in your opportunity"
}
```

#### Get Conversation Messages
```bash
GET /api/conversations/:conversationId/messages
Authorization: Bearer <jwt_token>
```

### Matching Endpoints

#### Get Matches (Volunteers get matching NGOs)
```bash
GET /api/matches
Authorization: Bearer <jwt_token>
```

#### Get Volunteer Matches for Opportunity (NGO)
```bash
GET /api/opportunities/:opportunityId/matches
Authorization: Bearer <jwt_token>
```

---

## ⚙️ Environment Variables

### Backend `.env` file

```env
# =======================
# Server Configuration
# =======================
PORT=5000
NODE_ENV=development

# =======================
# Database Configuration
# =======================
# Local MongoDB:
MONGO_URI=mongodb://localhost:27017/skillbridge

# MongoDB Atlas (Cloud):
# MONGO_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/skillbridge?retryWrites=true&w=majority

# =======================
# JWT Configuration
# =======================
JWT_SECRET=your_very_secure_secret_key_change_this_in_production
JWT_EXPIRE=7d

# =======================
# CORS Configuration
# =======================
FRONTEND_URL=http://localhost:5173

# =======================
# Socket.IO Configuration
# =======================
SOCKET_PORT=3001
```

**Important Security Notes:**
- Never commit `.env` file to Git
- Add `.env` to `.gitignore`
- Use strong JWT secret (min 32 characters)
- Use environment-specific values (dev/prod)
- Rotate secrets regularly in production

---

## ⚡ Command Reference

### Quick Commands

| Task | Command |
|------|---------|
| Install backend deps | `cd backend && npm install` |
| Install frontend deps | `cd frontend && npm install` |
| Start MongoDB (Windows) | `net start MongoDB` |
| Start MongoDB (Mac) | `mongod` |
| Start backend dev | `cd backend && npm run dev` |
| Start frontend dev | `cd frontend && npm run dev` |
| Build frontend | `cd frontend && npm run build` |
| Preview build | `cd frontend && npm run preview` |
| Clear npm cache | `npm cache clean --force` |
| Reinstall all deps | `rm -rf node_modules && npm install` |

### Development Workflow

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend  
cd frontend
npm run dev

# Open browser to http://localhost:5173
```

---

## 🛠 Troubleshooting

### Backend Issues

**Problem:** `MongoDB connection failed`
- **Solution:** Ensure MongoDB is running (`mongod` command)
- Check MONGO_URI in .env is correct
- Verify MongoDB service is started (Windows: `net start MongoDB`)

**Problem:** `Port 5000 already in use`
- **Solution:** Kill process on port 5000 or change PORT in .env
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Problem:** `JWT issues / Not authenticated`
- **Solution:** Check JWT_SECRET in .env is set
- Ensure token is being sent in Authorization header
- Clear browser localStorage and re-login

### Frontend Issues

**Problem:** `Cannot GET /api/...`
- **Solution:** Ensure backend is running on port 5000
- Check API base URL in frontend services

**Problem:** `Module not found`
- **Solution:** Run `npm install` in frontend folder
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**Problem:** `Vite port 5173 already in use`
- **Solution:** Kill process or use different port
- Or wait for previous process to fully terminate (up to 30 seconds)

### Common Issues

**Blank page on localhost:5173**
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check browser console for errors (F12)
- Verify backend is running

**Messages not appearing**
- Check Socket.IO connection in browser console
- Verify both users are logged in
- Ensure backend is running

**Database not persisting data**
- Check MongoDB is actually running
- Verify MONGO_URI in .env
- Check browser console and backend logs for errors

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is part of the Infosys Springboard Program.

---

## 👥 Team

Developed by Team 03 as part of Infosys Springboard Full Stack Milestone

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [Your Contact Info]

---

**Happy Coding! 🚀**

```bash
cd backend
npm run dev
```

Wait for this message: **Server running on http://localhost:5000**

#### **Step 3: Start Frontend** ⚛️

Open a **Terminal 2** (keep Terminal 1 running):

```bash
cd frontend
npm run dev
```

You'll see: **Local: http://localhost:5173**

#### **Step 4: Access the Application** 🌐

Open your browser and go to: **http://localhost:5173**

You're done! The application is now running locally. 🎉

---

### Running in Different Modes

#### Development Mode (Recommended for Development)
```bash
# Backend with auto-restart
cd backend
npm run dev

# Frontend with hot-reload
cd frontend
npm run dev
```

#### Production Mode (Testing before deployment)
```bash
# Backend
cd backend
npm start

# Frontend - build static files
cd frontend
npm run build
npm run preview
```

---

## Available npm Scripts

### Backend Scripts (in `backend/` folder)

| Command | Purpose | Use When |
|---------|---------|----------|
| `npm run dev` | Start with auto-restart (nodemon) | During development |
| `npm start` | Start without auto-restart | Testing production or deploying |
| `npm install` | Install all dependencies | After cloning or updating package.json |

### Frontend Scripts (in `frontend/` folder)

| Command | Purpose | Use When |
|---------|---------|----------|
| `npm run dev` | Start dev server with hot-reload | During development (port 5173) |
| `npm run build` | Build optimized production files | Before deployment |
| `npm run preview` | Preview production build locally | Testing production build |
| `npm install` | Install all dependencies | After cloning or updating package.json |

---

## 🛠️ Project Structure Guide for Developers

### Understanding the Backend Structure

**`backend/server.js`** - Entry point
- Starts Express server on port 5000
- Sets up MongoDB connection
- Configures CORS and Socket.IO

**`backend/config/db.js`** - Database connection
- Connects to MongoDB
- Handles database initialization

**`backend/models/`** - Data schemas
- `user.js` - Volunteer and NGO user accounts
- `opportunity.js` - Volunteer opportunities
- `application.js` - Applications from volunteers
- `conversation.js` - Chat conversations
- `message.js` - Chat messages
- `notification.js` - System notifications

**`backend/controllers/`** - Business logic
- Handles requests from frontend
- Queries database
- Returns responses

**`backend/routes/`** - API endpoints
- Defines which URLs map to which controllers
- Example: `/api/opportunities` routes to opportunityController

**`backend/middleware/authMiddleware.js`** - Authentication
- Verifies JWT tokens
- Protects private routes

### Understanding the Frontend Structure

**`frontend/src/main.jsx`** - Entry point
- Initializes React app
- Connects to root HTML element

**`frontend/src/App.jsx`** - Main component
- Sets up routing
- Wraps app with providers (Auth, Theme)

**`frontend/src/pages/`** - Full page components
- Each file = one page (Home, Login, Dashboard, etc.)
- Gets displayed when user navigates to that route

**`frontend/src/components/`** - Reusable components
- Used by multiple pages
- Example: Navbar, Sidebar, NotificationBell

**`frontend/src/services/`** - API communication
- `api.js` - Axios HTTP client configuration
- Other services make HTTP requests to backend
- Name pattern: serviceNameService.js

**`frontend/src/context/AuthContext.jsx`** - Global authentication state
- Stores logged-in user info
- Available to all components

**`frontend/src/routes/AppRoutes.jsx`** - Route definitions
- Maps URLs to page components

### Data Flow Example: Registering a User

1. **Frontend** (User fills form at `/register`)
2. **Frontend calls** `userService.register()` (in services/)
3. **HTTP POST** sent to backend: `POST /api/auth/register`
4. **Backend receives** request in `authController.js`
5. **Controller uses** `User` model to save to MongoDB
6. **Backend returns** success/error response
7. **Frontend receives** response, stores user token
8. **Frontend redirects** to dashboard

### Common Development Tasks

**Adding a new API endpoint:**
1. Create route in `backend/routes/neuroutes.js`
2. Create or update controller in `backend/controllers/newController.js`
3. Import route in `server.js`
4. Call from frontend using axios in service

**Adding a new page:**
1. Create file in `frontend/src/pages/NewPage.jsx`
2. Add route in `frontend/src/routes/AppRoutes.jsx`
3. Add navigation link in `Navbar.jsx`

---

## Environment Variables

### How to Create .env File

1. Open Notepad or any text editor
2. Copy the content below for your backend
3. Save as `.env` in the `backend` folder (important: not `.env.txt`)

### Backend .env Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| **PORT** | Server port where backend runs | 5000 | ✅ Yes |
| **MONGO_URI** | MongoDB connection string for database | mongodb://localhost:27017/skillbridge | ✅ Yes |
| **JWT_SECRET** | Secret key for JWT authentication (use any random string) | your_random_secret_key_12345 | ✅ Yes |
| **JWT_EXPIRE** | How long JWT tokens are valid | 7d | ✅ Yes |
| **FRONTEND_URL** | Frontend URL (for CORS security) | http://localhost:5173 | ⚠️ Optional |

**Complete Sample .env File:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillbridge
JWT_SECRET=your_random_secret_key_12345_change_this_in_production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Recommended Packages Already Included

Your `npm install` has already installed these essential packages:

**Backend Dependencies (backend/package.json):**
- `express` - Web framework
- `mongoose` - Database ORM
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password encryption
- `cors` - Cross-origin requests
- `socket.io` - Real-time communication
- `dotenv` - Environment variables
- `nodemon` - Auto-restart during development

**Frontend Dependencies (frontend/package.json):**
- `react` - UI library
- `react-router-dom` - Page routing
- `axios` - HTTP requests
- `socket.io-client` - Real-time updates
- `vite` - Build tool (super fast!)
- `@radix-ui` - UI components
- `sonner` - Toast notifications

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

### Common Issues & Solutions

#### 1. ❌ "MongoDB Connection Error" or "Cannot connect to MongoDB"

**Causes & Solutions:**
- MongoDB is not running
  ```bash
  # Windows: Start MongoDB
  net start MongoDB
  
  # Mac/Linux: Start MongoDB
  mongod
  ```
- Wrong `MONGO_URI` in `.env` file
  ```
  ✅ Correct: MONGO_URI=mongodb://localhost:27017/skillbridge
  ❌ Wrong: MONGO_URI=mongodb://27017/skillbridge
  ```
- Check if MongoDB is listening on port 27017
  ```bash
  # Check if port 27017 is in use (Windows)
  netstat -ano | findstr :27017
  ```

---

#### 2. ❌ "Cannot GET /" or "Connection refused on localhost:5173"

**Solutions:**
- Frontend is not running. Make sure Terminal 2 shows:
  ```
  ✅ Local: http://localhost:5173
  ```
- Try clearing browser cache: `Ctrl+Shift+Delete` → Clear All
- Check if port 5173 is already in use by another process
- Make sure you ran `npm install` in the frontend folder

---

#### 3. ❌ "CORS Error" or "Access to XMLHttpRequest blocked"

**Causes:**
- Backend and frontend ports don't match
- Missing `FRONTEND_URL` in backend `.env`

**Solutions:**
```env
# Backend .env should have:
PORT=5000
FRONTEND_URL=http://localhost:5173
```
- Verify backend is running on `http://localhost:5000`
- Verify frontend is running on `http://localhost:5173`

---

#### 4. ❌ "Socket.IO Connection Issues" or Real-time updates not working

**Causes:**
- Backend not running
- Firewall blocking ports

**Solutions:**
- Ensure backend is running: Check Terminal 1 shows `Server running on http://localhost:5000`
- Disable firewall temporarily to test
- Check network settings if on corporate network

---

#### 5. ❌ "JWT Token / Authentication Errors" or "Cannot login"

**Solutions:**
- Clear browser localStorage:
  ```javascript
  // Open browser DevTools (F12) → Console, then run:
  localStorage.clear()
  ```
- Reload page: `Ctrl+F5` (hard refresh)
- Verify `.env` has `JWT_SECRET` set (must be non-empty string)
- Check MongoD is running (user data might not be saving)

---

#### 6. ❌ "npm: command not found" or "'npm' is not recognized"

**Solution:**
- Node.js/npm not installed correctly
- Reinstall from: https://nodejs.org/
- Verify installation: `node --version` and `npm --version`

---

#### 7. ❌ "Port already in use" (port 5000 or 5173)

**Find and kill process using the port:**

```bash
# Windows - Find process on port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with the number found above)
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

---

#### 8. ❌ "npm ERR! cannot find module" after npm install

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Verify Everything is Working

Use this checklist to confirm the setup:

- [ ] MongoDB is running (check terminal shows `mongod` or Windows Service started)
- [ ] Backend terminal shows: `Server running on http://localhost:5000`
- [ ] Frontend terminal shows: `Local: http://localhost:5173`
- [ ] Browser shows the SkillBridge homepage (not blank or error)
- [ ] Can register a new account successfully
- [ ] Can login with registered account
- [ ] Dashboard loads without errors (check DevTools F12)

---

### Getting Help

If issues persist:

1. **Check browser console** (F12 → Console) for error messages
2. **Check backend terminal** for error logs
3. **Verify .env file** has all required variables
4. **Try hard refresh**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
5. **Restart everything**:
   ```bash
   # Kill all terminals and restart from scratch
   # 1. Stop MongoDB
   # 2. Start MongoDB again
   # 3. Start Backend (new terminal)
   # 4. Start Frontend (another new terminal)
   ```

---

## Running in Production

For production deployment:

1. Build frontend: `cd frontend && npm run build`
2. Serve static files from Express
3. Use environment variables for production database

---

## 🎯 Next Steps - Things to Try After Setup

Once the application is running at **http://localhost:5173**, try these actions:

### Test Volunteer Account
1. **Register** → Click "Register" → Select "Volunteer" → Fill form
2. **Login** with your credentials
3. Go to **Profile** → Add skills (JavaScript, React, etc.)
4. Browse **Opportunities** → See available NGO opportunities
5. **Apply** to an opportunity
6. Check **Applications** → See your submitted applications
7. **Messages** → Send message to an NGO (if accepted)

### Test NGO Account
1. In a **new browser tab/window** (or private mode), register as NGO
2. **Register** → Click "Register" → Select "NGO" → Fill form
3. Go to **My Opportunities** → **Create Opportunity**
   - Title: "Website Developer Needed"
   - Skills: JavaScript, React
   - Description: Help build our NGO website
4. Back to volunteer browser tab → Refresh **Opportunities**
5. You should see the opportunity posted by NGO
6. See volunteer applications (**Applications** section in NGO account)
7. Accept/Reject applications

### Test Real-time Messaging
1. Keep both volunteer & NGO browser tabs open
2. Accept an application in NGO account
3. Go to **Messages** in volunteer account
4. Send message to NGO
5. Should appear instantly in NGO's **Messages** (without refresh!)

### Test Dashboard
- Each account has a personalized **Dashboard**
- Shows statistics, recent messages, applications, etc.

---

## ✋ Stop Here & Review

Before proceeding with code changes, verify:
- ✅ MongoDB is running
- ✅ Backend terminal shows no errors
- ✅ Frontend terminal shows no errors
- ✅ Can register and login as volunteer
- ✅ Can register and login as NGO
- ✅ Can see both accounts' features

If any of above fails, check **Troubleshooting** section above.

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

