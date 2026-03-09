# realtime-project-workspace
Realtime Project Workspace:
A full-stack team collaboration platform similar to Trello / Notion Lite that allows teams to create projects, manage tasks on a Kanban board, and collaborate in real-time.
---
# Features

- User Authentication (JWT)
- Role Based Access (Admin / Member)
- Project CRUD
- Task CRUD
- Kanban Board (To-Do / In-Progress / Done)
- Drag & Drop Tasks
- Task Filters (priority, status, assignee)
- File Upload Attachments
- Activity Timeline
- Project Analytics
- Pagination
- WebSocket realtime updates

---

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- PostgreSQL

### Other Technologies
- JWT Authentication
- Socket.io (Real-time updates)
- Multer (File uploads)

## Project Structure

```
realtime-project-workspace
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── uploads
│   ├── db.js
│   └── server.js
│
├── frontend
│   ├── app
│   ├── services
│   └── components
│
└── README.md
```

## How to Run the Project:
### 1. Clone the repository:  
''' bash 
git clone https://github.com/shreshtareddy862-rgb/realtime-project-workspace.git
### 2. Start Backend:
     Navigate to backend folder: cd backend
     Install dependencies: npm install
     Create .env file in backend folder:
         PORT=5001
         DATABASE_URL=postgresql://username:password@localhost:5432/workspace
         JWT_SECRET=your_secret_key
     Run backend server: node server.js
     Backend will run on: http://localhost:5001
  3. Start Frontend:
     Open a new terminal and navigate to frontend folder: cd frontend
     Install dependencies: npm install
     Start frontend: npm run dev
     Frontend will run on: http://localhost:3000

API Routes:
 Authentication:
   Register User: POST /auth/register
   Login User: POST /auth/login

Projects:
1. Get all projects: GET /projects
2. Create project: POST /projects
3. Update project: PUT /projects/:id
4. Delete project: DELETE /projects/:id

Tasks:
Get tasks for a project: GET /tasks/:projectId
Create task: POST /tasks
Update task: PUT /tasks/:id
Update task status (drag & drop): PUT /tasks/status/:id
Delete task: DELETE /tasks/:id
Upload task attachment:POST /tasks/upload/:id


Activity Logs:
Get project activity timeline: GET /activities/:projectId
Returns activity logs such as task creation, updates, and status changes.

Author: Butukuri Shreshta


     
