# 📝 ClearPlan

**ClearPlan** is a modern, full-stack web application for personal project and task management. It allows users to register, log in securely, create multiple projects, and manage associated tasks.

This project was built as a practical exercise in secure authentication, CRUD APIs, modular design, validation, and responsive UI.

---

## 🛠️ Technologies  Used

### 🔧 Backend
- **ASP.NET Core 8 (C#)** – RESTful API
- **EF Core** – ORM (Object-Relational Mapping) with SQLite database
- **JWT Authentication + Bcrypt** – Secure auth & password hashing
- **DataAnnotations** – Input validation
- **Layered Architecture** – Controllers, Services, DTOs, Utils, etc.

### 🖥️ Frontend
- **React + TypeScript** – Modular structure
- **Vite** – Fast development tooling
- **Tailwind CSS** – Utility-first styling with accessibility in mind
- **React Router** – Client-side routing
- **Custom Alerts + Form Validation** – For a smooth UX

---

## ✨ Features

- Secure JWT-based Authentication (Login / Register)
- Project CRUD: create, view and delete personal projects
- Task Management: add, edit, delete and complete tasks
- Navigation with React Router
- Fully responsive and accessible design
- Custom dialogs
- Robust form validation (client + server side)
- Environment-driven config (ports, API URL)

---

## 📸 Screenshots

### 🏠 Home Page
<img src="https://github.com/user-attachments/assets/01768407-853c-46b2-8de2-d2966358b85d" alt="HomePage" width="100%" />

---

### 🔐 Login / Register

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/10f5cf52-a08c-46a8-8d1f-a0a35cc08226" alt="Login Page" width="600" /><br />
      <strong>Login</strong>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/141a52bd-f9bd-43d7-94f5-bbd0586ddade" alt="Register Page" width="600" /><br />
      <strong>Register</strong>
    </td>
  </tr>
</table>

---

### 📁 Project Dashboard / Create Project

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/9e040429-dee5-4fcb-aa3c-dec406677406" alt="My Projects" width="600" /><br />
      <strong>User Projects</strong>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6aab2da5-2224-4ea3-adb2-3c747b58100d" alt="Create New Project" width="600" /><br />
      <strong>Create Project</strong>
    </td>
  </tr>
</table>

---
### ✅ Task Management Flow

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/5dc3d256-6935-4ef8-a23f-f482045a2f25" alt="Tasks Table" width="600" /><br />
      <strong>View Tasks in Project</strong>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/41424c3a-26fa-48d7-8c03-63d980db5aff" alt="Add Task" width="600" /><br />
      <strong>Add New Task</strong>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a9f73c3c-e5b5-4f76-9eb1-8182de159d60" alt="Add Task Success" width="600" /><br />
      <strong>Success Dialog (Task Added)</strong>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/efcd14e0-15ec-498c-afb9-21867f22b71e" alt="Modify Task" width="600" /><br />
      <strong>Edit Task Inline</strong>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/3a652c7b-08f3-44b2-a1f7-30733c23f365" alt="Delete Task" width="600" /><br />
      <strong>Delete Task Confirmation</strong>
    </td>
  </tr>
</table>

---

## 📂 Project Structure

```bash
mini-project-manager/
├── backend/         # .NET 8 Web API
├── frontend/        # Vite + React + TS + Tailwind
├── assets/          # Static files 
├── .env             # Shared env vars
├── package.json     # Root scripts for dev & deploy
```

#### Backend:
```bash
/backend
├── Controllers/
├── Interfaces/
├── Services/
├── Models/
├── DTOs/
├── Data/
├── Utils/
├── Constants.cs
├── Program.cs
└── app.db           # SQLite DB 
```

#### Frontend:
```bash
/frontend
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── project/
│   │   └── task/
│   ├── utils/
│   └── App.tsx
└── index.html
```
---

## 🚀 Getting Started

### 🔧 Prerequisites

Ensure you have the following installed:

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (v18+ recommended)](https://nodejs.org/)
- [SQLite CLI](https://sqlite.org)
- [Vite](https://vitejs.dev/) (installed via npm)


### 📦 Installation

1. **Clone the repository:**

```bash
git clone https://github.com/HadarDaya/ClearPlan-FullStack.git
cd ClearPlan-FullStack
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

3. **Set up environment variables (optional):**
</br> Create a .env file at the root of the project:
```bash
# .env
VITE_BACKEND_URL=http://localhost:5286
VITE_PORT=5173
```

ℹ️ You can also configure the backend FrontendUrl in appsettings.json or override it via environment variable.

4. **Run the App Locally:**
</br> From the root directory, run:
```bash
npm run dev
```
This command:
- Starts the .NET 8 backend from the backend/ folder.
- Starts the React frontend (Vite) from the frontend/ folder.
- Runs both servers concurrently with live reload on code changes.

---

## 🔐 Authentication
After a successful login, the server returns a signed JWT containing the user's ID. This token is stored on the client side and automatically included in the Authorization header of all subsequent API requests. On the server, the token is validated and the user ID is extracted from its claims to authorize and personalize access to protected resources.

---

## 📦 API Endpoints

#### Auth:
| Method | Endpoint              | Description                     |
|--------|------------------------|---------------------------------|
| POST   | /api/auth/register   | Create new user                 |
| POST   | /api/auth/login      | Authenticate user               |


#### Projects:

| Method | Endpoint                | Description                              |
|--------|--------------------------|------------------------------------------|
| GET    | /api/projects          | Get all projects for authenticated user  |
| POST   | /api/projects          | Create a new project                     |
| GET    | /api/projects/{id}     | Get tasks for a specific project         |
| DELETE | /api/projects/{id}     | Delete project                           |

#### Tasks:

| Method | Endpoint                              | Description               |
|--------|----------------------------------------|---------------------------|
| POST   | /api/projects/{projectId}/tasks      | Add new task to project   |
| PUT    | /api/tasks/{taskId}                  | Update task               |
| DELETE | /api/tasks/{taskId}                  | Delete task               |

All routes under /api/* (except /auth/*) require a valid JWT in the Authorization header.

---
