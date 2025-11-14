
# 🧠 Fullstack Hackathon — Todo List Project

This project is a Fullstack Todo List Application built with the MERN stack (MongoDB integration coming soon).
Currently, all data is stored in a JSON file instead of a database.

The goal of this hackathon is to develop a simple yet functional Todo List app that connects Frontend (React) and Backend (Node.js + Express).

# 🧰 Tech Stack

Frontend: React, Vite, Axios, React Icons, React Toastify, Framer Motion

Backend: Node.js, Express.js

Utilities: UUID, CORS, FS, Path, Dotenv, Morgan, Chalk, Joi

Data Storage: JSON file (temporary), MongoDB (coming soon)

# 🧱 Main Features

➕ Add new tasks

👀 View all tasks

✅ Toggle task status (completed / not completed)

❌ Delete tasks

🔄 Real-time sync between frontend and backend

🎨 Smooth animations with Framer Motion

🔔 Toast notifications for success and error messages

# ⚙️ How to Run the Project

## **🗄️ Backend Setup**

1. Open a terminal in the project root

Run the following commands:

2. cd backend
3. npm install
4. npm run dev


The backend will start on:
👉 http://localhost:1234

## **💻 Frontend Setup**

1. Open another terminal in the project root

Run the following commands:

2. cd frontend
3. npm install
4. npm run dev


The app will be available at:
👉 http://localhost:5173

🎯 API Endpoints
| Route | Method | Description |
|--------|---------|-------------|
| `/api/todos` | **GET** | Get all Todos |
| `/api/todos` | **POST** | Add a new Todo |
| `/api/todos/:id` | **PUT** | Update a Todo (e.g. toggle status) |
| `/api/todos/:id` | **DELETE** | Delete a Todo |

Todo Object Example:

```json
{
  "id": "string",
  "title": "string",
  "completed": "boolean",
  "date": "string"
}
```
