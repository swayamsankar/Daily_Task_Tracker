# ⚡ TaskSway — Kinetic Productivity Sanctuary

A full-stack **Daily Task Management & Productivity Tracker** with performance analytics, streak tracking, and deep work sessions. Built with React, Node.js, Express, and MongoDB.

<img width="1902" height="912" alt="image" src="https://github.com/user-attachments/assets/d9c79cac-d3a8-4afc-9855-b35b5c549349" />
<img width="1897" height="908" alt="image" src="https://github.com/user-attachments/assets/bca4cabd-a489-4f83-b3aa-cdd79b23dcb6" />
<img width="1901" height="908" alt="image" src="https://github.com/user-attachments/assets/55159b89-f9f7-449c-bb8c-0d693820a843" />




---

## 📁 Folder Structure

```
Daily_Task_Tracker/
└── Daily_Task/
    │
    ├── backend/
    │   ├── controllers/
    │   │   ├── analyticsController.js
    │   │   ├── authController.js
    │   │   ├── taskController.js
    │   │   └── userController.js
    │   │
    │   ├── middleware/
    │   │   └── auth.js
    │   │
    │   ├── models/
    │   │   ├── DailyScore.js
    │   │   ├── Task.js
    │   │   └── User.js
    │   │
    │   ├── routes/
    │   │   ├── analytics.js
    │   │   ├── auth.js
    │   │   ├── tasks.js
    │   │   └── users.js
    │   │
    │   ├── uploads/              
    │   │
    │   ├── .env                  
    │   ├── package.json
    │   ├── package-lock.json
    │   └── server.js
    │
    ├── frontend/
    │   ├── public/
    │   │   └── index.html
    │   │
    │   ├── src/
    │   │   ├── components/
    │   │   │   ├── Analytics/
    │   │   │   │   └── Analytics.js
    │   │   │   │
    │   │   │   ├── Auth/
    │   │   │   │   ├── Login.js
    │   │   │   │   └── Signup.js
    │   │   │   │
    │   │   │   ├── BottomNav/
    │   │   │   │   └── BottomNav.js   ✅ (mobile navbar)
    │   │   │   │
    │   │   │   ├── common/
    │   │   │   │   └── AppLayout.js
    │   │   │   │
    │   │   │   ├── Dashboard/
    │   │   │   │   └── Dashboard.js
    │   │   │   │
    │   │   │   ├── Settings/
    │   │   │   │   └── Settings.js
    │   │   │   │
    │   │   │   └── Tasks/
    │   │   │       ├── TaskDrawer.js
    │   │   │       └── Tasks.js
    │   │   │
    │   │   ├── context/
    │   │   │   ├── AuthContext.js
    │   │   │   └── SearchContext.js
    │   │   │
    │   │   ├── styles/
    │   │   │   └── global.css
    │   │   │
    │   │   ├── App.js
    │   │   └── index.js
    │   │
    │   ├── .env.example          
    │   ├── package.json
    │   ├── package-lock.json
    │   └── vercel.json
    │
    ├── .gitignore               ✅
    ├── package.json             (root - optional)
    └── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/tasksway.git
cd tasksway
npm run install:all
```

### 2. Configure Environment

**Backend** — copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tasksway
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend** — copy `frontend/.env.example` to `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Run Development

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000) concurrently.

---
## 🌐 Live Demo

* **Frontend (Live URL):** [https://your-frontend-url.com](https://tasksway.netlify.app/)
* **Backend (API URL):** [https://your-backend-url.com](https://tasksway.onrender.com)

> Replace the above links with your deployed frontend (e.g., Vercel/Netlify) and backend (e.g., Render/Railway) URLs.


---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login + get JWT token |
| GET | `/api/auth/me` | Get current user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get tasks (filter by `?date=`, `?category=`) |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task (including completion) |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/today/stats` | Today's stats + streak |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/performance?period=7\|30` | Performance data |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/users/profile` | Update profile + avatar |
| PUT | `/api/users/password` | Change password |

---

## ✨ Features

- 🔐 **JWT Authentication** — secure signup/login
- ✅ **Task CRUD** — create, edit, delete, complete tasks
- 📊 **Daily Score** — `(completed / total) × 100`
- 🔥 **Streak Tracking** — consecutive fully-completed days
- 📈 **Analytics** — area charts, category allocation, benchmarks
- 🎯 **Deep Work Timer** — 45-minute focus sessions
- 🌙 **Dark/Light Mode** — persisted per user
- 📱 **Responsive** — mobile + desktop
- 🔔 **Push/Email Notifications** preferences
- 🖼️ **Avatar Upload** — via multipart form data

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Recharts, react-hot-toast |
| Styling | Custom CSS Design System (CSS Variables) |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Fonts | Syne (display) + DM Sans (body) — Google Fonts |

---
## 👨‍💻 Developed By

**Swayam Sankar Nayak**

## ⭐ Support & Feedback

If you find this project useful, please ⭐ star the repository on GitHub.

Feel free to try it out and share your feedback — good ratings and suggestions are always appreciated!

---

## 📄 License

MIT © 2026 TaskSway

