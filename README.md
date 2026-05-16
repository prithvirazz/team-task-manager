# Team Task Manager

A full-stack web application for creating projects, managing team members, assigning tasks, and tracking project progress with role-based access control.

## Live Demo

Live URL: Coming soon

## GitHub Repository

Repository URL: [https://github.com/prithvirazz/team-task-manager]

---

## Features

- User signup and login
- JWT-based authentication
- Admin and Member roles
- Role-based access control
- Project creation and management
- Add team members to projects
- Task creation and assignment
- Task status tracking
- Dashboard analytics
- Overdue task tracking
- Responsive frontend UI
- REST API integration with database relationships

---

## User Roles

### Admin

Admin users can:

- Create projects
- Add members to projects
- Create tasks
- Assign tasks to project members
- Update task status
- View dashboard summary
- View projects created by them
- View tasks created by them

### Member

Member users can:

- View projects assigned to them
- View tasks assigned to them
- Update the status of their assigned tasks
- View personal dashboard summary

---

## Tech Stack

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Database

- MongoDB Atlas

### Deployment

- Railway

---

## Project Structure

```txt
team-task-manager/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Auth Routes

```txt
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
```

### Project Routes

```txt
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/members
```

### Task Routes

```txt
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### Dashboard Routes

```txt
GET /api/dashboard/summary
```

---

## Database Models

### User

```js
{
  name: String,
  email: String,
  password: String,
  role: "admin" | "member"
}
```

### Project

```js
{
  name: String,
  description: String,
  admin: ObjectId,
  members: [ObjectId]
}
```

### Task

```js
{
  title: String,
  description: String,
  project: ObjectId,
  assignedTo: ObjectId,
  createdBy: ObjectId,
  status: "todo" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  dueDate: Date
}
```

---

## Demo Credentials

### Admin

```txt
Email: admin@test.com
Password: admin123
```

### Member

```txt
Email: member@test.com
Password: member123
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPO_URL
cd team-task-manager
```

### 2. Backend setup

```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

The backend will run on:

```txt
http://localhost:5000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

Optional frontend `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Environment Variables

### Backend Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend Environment Variables

Create `client/.env` if needed:

```env
VITE_API_URL=http://localhost:5000/api
```

For deployment, `VITE_API_URL` should point to the deployed backend API URL.

Example:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Deployment Notes

This project is designed for Railway deployment using two services from the same GitHub repository.

### Backend Service

Root directory:

```txt
/server
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

Required backend environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend Service

Root directory:

```txt
/client
```

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm run preview -- --host 0.0.0.0
```

Required frontend environment variable:

```env
VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## Application Flow

1. User signs up or logs in.
2. JWT token is stored in local storage.
3. Admin can create projects.
4. Admin can add members to projects.
5. Admin can create tasks and assign them to members.
6. Members can view their assigned projects and tasks.
7. Members can update task status.
8. Dashboard displays project count, task count, completed tasks, pending tasks, and overdue tasks.

---

## Screens

The application includes:

- Login page
- Signup page
- Dashboard page
- Projects page
- Tasks page

---

## Security

- Passwords are hashed using bcryptjs.
- Authentication is handled using JWT.
- Protected routes require a valid token.
- Admin-only routes are protected using role-based middleware.
- Environment variables are excluded from GitHub using `.gitignore`.

---

## Author

Prithvi Raj Kaushik Metpally
