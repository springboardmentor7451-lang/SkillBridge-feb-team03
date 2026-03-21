# SkillBridge – Volunteer & NGO Collaboration Platform

SkillBridge is a full-stack web application that connects volunteers with NGOs based on skills, interests, and opportunities. The platform enables volunteers to discover meaningful opportunities and allows NGOs to post and manage volunteer requirements efficiently.

---

## 🚀 Quick Start

Want to get the application running in 5 minutes? Follow these quick steps:

```bash
# 1. Clone the repository
git clone https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03.git
cd SkillBridge-feb-team03

# 2. Install Backend Dependencies
cd backend
npm install

# 3. Create .env file in backend folder (see Setup section below)

# 4. Start Backend (Terminal 1)
npm run dev

# 5. In a new terminal, Install Frontend Dependencies
cd frontend
npm install

# 6. Start Frontend (Terminal 2)
npm run dev

# 7. Open http://localhost:5173 in your browser
```

---

## Project Overview

SkillBridge bridges the gap between skilled volunteers and NGOs by providing a centralized platform for collaboration. Volunteers can create profiles, showcase skills, and apply for opportunities, while NGOs can create opportunities, review applications, and communicate with volunteers.

This project was developed as part of the Infosys Springboard Full Stack Milestone.

---

## ⚡ Command Reference Cheat Sheet

**For copying and pasting commands quickly:**

| Task | Command |
|------|---------|
| **Install backend packages** | `cd backend && npm install` |
| **Install frontend packages** | `cd frontend && npm install` |
| **Start MongoDB** | `mongod` (Mac/Linux) or `net start MongoDB` (Windows) |
| **Start backend (auto-restart)** | `cd backend && npm run dev` |
| **Start frontend (hot-reload)** | `cd frontend && npm run dev` |
| **Build frontend for production** | `cd frontend && npm run build` |
| **Check Node version** | `node --version` |
| **Check npm version** | `npm --version` |
| **Clear npm cache** | `npm cache clean --force` |
| **Reinstall dependencies** | `rm -rf node_modules package-lock.json && npm install` |

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

### Prerequisites

Before starting, ensure you have these installed on your machine:

| Software | Version | Purpose | Download |
|----------|---------|---------|----------|
| **Node.js** | 14+ | JavaScript runtime for both frontend & backend | https://nodejs.org/ |
| **npm** | 6+ | Package manager (comes with Node.js) | Included with Node.js |
| **MongoDB** | 4+ | Database for the application | https://www.mongodb.com/try/download/community OR https://www.mongodb.com/cloud/atlas (cloud) |
| **Git** | Any | Version control (optional) | https://git-scm.com/ |

**Verify Installation:**
```bash
node --version          # Should show v14 or higher
npm --version           # Should show 6 or higher
mongod --version        # Should show MongoDB version
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03.git
cd SkillBridge-feb-team03
```

Or download as ZIP and extract it.

---

### 2. Backend Setup

Navigate to the backend directory and install all required packages:

```bash
cd backend
npm install
```

This will install the following packages:

| Package | Purpose | Version |
|---------|---------|---------|
| **express** | Web framework | ^4.x |
| **mongoose** | MongoDB object modeling | ^7.x |
| **jsonwebtoken** | JWT authentication | ^9.x |
| **bcryptjs** | Password hashing | ^2.x |
| **dotenv** | Environment variables | ^16.x |
| **cors** | Cross-origin resource sharing | ^2.x |
| **socket.io** | Real-time communication | ^4.x |
| **express-validator** | Input validation | ^7.x |
| **nodemon** | Auto-restart on file changes (dev) | ^2.x |

**Create `.env` file in the `backend` folder:**

```env
# Server Configuration
PORT=5000

# MongoDB Connection
# Option A: Local MongoDB (make sure MongoDB is running)
MONGO_URI=mongodb://localhost:27017/skillbridge

# Option B: MongoDB Atlas (Cloud - recommended for production)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbridge

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

**Install MongoDB (if using local database):**

- **Windows**: Download from https://www.mongodb.com/try/download/community
- **Mac**: `brew install mongodb-community`
- **Linux**: `sudo apt-get install mongodb`

**Start the backend server:**

```bash
# Development mode (with auto-restart using nodemon)
npm run dev

# OR Production mode (without auto-restart)
npm start
```

✅ Backend will run on: **http://localhost:5000**

---

### 3. Frontend Setup

Open a **new terminal** (keep backend running in first terminal), then:

```bash
cd frontend
npm install
```

This will install the following packages:

| Package | Purpose | Version |
|---------|---------|---------|
| **react** | UI library | ^18.x |
| **react-dom** | React DOM rendering | ^18.x |
| **react-router-dom** | Client-side routing | ^6.x |
| **axios** | HTTP client | ^1.x |
| **socket.io-client** | Real-time client communication | ^4.x |
| **vite** | Frontend build tool | ^4.x |
| **@radix-ui/\*** | UI component library | Latest |
| **sonner** | Toast notifications | Latest |

**Start the development server:**

```bash
npm run dev
```

✅ Frontend will run on: **http://localhost:5173**

---

### 4. Setup MongoDB

#### Option A: Local MongoDB (Windows/Mac/Linux)

**Start MongoDB Server:**

```bash
# Windows (Command Prompt/PowerShell)
net start MongoDB

# OR manually start from installation folder
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
```

```bash
# Mac/Linux
mongod
```

MongoDB will run on: **mongodb://localhost:27017**

#### Option B: MongoDB Atlas (Cloud) - Recommended for Teams

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/skillbridge`
4. Add connection string to `.env` file

---

## Running the Application

### Complete Step-by-Step Guide for First-Time Users

#### **Step 1: Start MongoDB** ⚙️

This is the database for your application.

```bash
# Windows (Command Prompt as Administrator)
net start MongoDB

# Mac/Linux
mongod
```

You should see: `MongoDB listening on 27017` or similar message.

#### **Step 2: Start Backend** 🔧

Open a **Terminal 1**:

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

