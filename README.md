# SkillBridge – Volunteer & NGO Collaboration Platform

SkillBridge is a full-stack web application that connects volunteers with NGOs based on skills, interests, and opportunities. The platform enables volunteers to discover meaningful opportunities and allows NGOs to post and manage volunteer requirements efficiently.

---

## Project Overview

SkillBridge bridges the gap between skilled volunteers and NGOs by providing a centralized platform for collaboration. Volunteers can create profiles, showcase skills, and apply for opportunities, while NGOs can create opportunities, review applications, and communicate with volunteers.

This project was developed as part of the Infosys Springboard Full Stack Milestone.

---

## Features

### Authentication

* User registration (Volunteer / NGO)
* Secure login using JWT authentication
* Role-based user profiles

### Volunteer Features

* Create and manage profile
* Add skills and bio
* Browse opportunities
* Apply for NGO opportunities
* View application status

### NGO Features

* Create organization profile
* Post volunteer opportunities
* Manage applications
* View volunteer profiles

### Dashboard

* Personalized dashboard
* Application statistics
* Opportunity management
* Skills overview

---

## Tech Stack

### Frontend

* React.js (Vite)
* JavaScript
* CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

---

## Project Structure

```
SkillBridge-feb-team03/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── routes/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
└── README.md
```

---

## Installation and Setup

### Clone the repository

```
git clone https://github.com/springboardmentor7451-lang/SkillBridge-feb-team03.git
```

```
cd SkillBridge-feb-team03
```

---

### Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000
```

Run backend:

```
node server.js
```

---

### Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### User

```
GET /api/users/me
```

---

## Milestone Completion

This project successfully implements Milestone 1 requirements:

* User Registration
* User Login
* JWT Authentication
* Profile Creation
* Protected Routes
* Frontend UI
* Backend API Integration

---

## Future Improvements

* Opportunity posting system
* Application management
* Messaging system
* Profile editing
* Deployment

---

## Author

Aman Kumar
Infosys Springboard Internship Project

---

## License

This project is created for educational and internship purposes.
