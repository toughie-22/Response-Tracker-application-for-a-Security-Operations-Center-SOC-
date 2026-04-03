# 🛡️ SOC Incident Response Tracker

A full-stack web application designed for a Security Operations Center (SOC) to effectively manage, track, and respond to security incidents.

## 🚀 Built With
* **Frontend:** React, Vite, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JSON Web Tokens (JWT)

## 📁 Project Structure

The project is divided into two main sections:
* `frontend/` - The React application providing the dashboard and user interface.
* `backend/` - The Express server handling the API, authentication, and database connections.

## 🛠️ Setup Instructions

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

### 1. Clone the repository
```bash
git clone https://github.com/toughie-22/Response-Tracker-application-for-a-Security-Operations-Center-SOC-.git
cd Response-Tracker-application-for-a-Security-Operations-Center-SOC-
```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder and add your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the server: `npm run dev` or `node server.js`

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

## 🔒 Security Note
Certain files such as `node_modules` and `.env` are intentionally ignored by Git to protect sensitive database credentials and API keys.
