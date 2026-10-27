# task-manager-app
Task Manager with Authentication using Express.js and MongoDB

# Task Manager App
A full-stack task management web application that helps users organize, prioritize, and track their daily tasks. The application includes user authentication, task management, filtering, and a dashboard for monitoring task progress.

## Live Demo
- **Frontend:** [Add your Netlify URL]
- **Backend API:** https://task-manager-app-flpd.onrender.com
- **GitHub Repository:** https://github.com/muskankesherwani/task-manager-app

## Features

### User Authentication
- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- User-specific task access

### Task Management
- Create new tasks
- View tasks on the dashboard
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Set task categories, priorities, and due dates

### Task Organization
- Filter tasks by pending and completed status
- Search tasks by title or description
- View total, pending, and completed task counts

## Technology Stack
**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API
- JSON Web Tokens (JWT)
- bcryptjs

**Database**
- MongoDB Atlas
- Mongoose

**Deployment**
- Netlify — frontend hosting
- Render — backend hosting

## Architecture
The frontend communicates with the Express.js backend through HTTP requests. The backend handles authentication, validates requests, and interacts with MongoDB Atlas to store and retrieve user and task data.

## Local Setup

### Prerequisites
- Node.js and npm
- A MongoDB Atlas account or accessible MongoDB database
- Git

### 1. Clone the repository
```bash
git clone https://github.com/muskankesherwani/task-manager-app.git
cd task-manager-app
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Configure environment variables
Create a `.env` file inside the `backend` directory and configure the environment variables required by your backend, such as:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Use the exact variable names expected by your existing backend configuration. Keep your real credentials private and never commit your `.env` file.

### 4. Start the backend
From the `backend` directory, run:

```bash
node server.js
```

### 5. Open the frontend
Open the frontend using VS Code Live Server or another suitable static file server. Ensure the frontend API configuration points to the backend you intend to use.

## Security Notes
- Passwords are hashed before being stored.
- Protected endpoints require valid authentication.
- Tasks are associated with their respective users.
- Database credentials and JWT secrets should be stored in environment variables.

## Future Improvements
- Password reset through email
- Automated tests
- Improved loading and error states
- Additional task organization features

## Author
**Muskan Kesherwani**

Full-stack Task Manager project built to practice frontend development, backend APIs, database integration, authentication, and deployment.
