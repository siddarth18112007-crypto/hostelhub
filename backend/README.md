# HostelHub Backend API

This is the backend REST API for the **HostelHub** app. It uses **Node.js, Express, and SQLite** (via `sqlite3` driver).

## Features
- **Stateless Authentication**: Login and retrieve session JWT tokens.
- **REST Endpoints**: Complete support for profile details, roommates, mess menu, laundry booking, repair requests, events, alerts, settings, notification preferences, and issue reporting.
- **Auto-Initializing SQLite Database**: No database servers to setup. Creates a local `hostelhub.db` file automatically on start.
- **Seeded Mock Data**: Fully populated with the student "Sid (STU1024)" and all initial items.

## Prerequisites
1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/). This will also install `npm`.

## Setup Instructions

1. **Open your terminal** and navigate to the backend folder:
   ```bash
   cd d:\hostelhub\hostelhub\backend
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Seed the database** with the initial mock data:
   ```bash
   npm run seed
   ```

4. **Start the API Server**:
   ```bash
   npm start
   ```

The backend server will run at: **`http://localhost:3001`**

## Default Credentials
- **Student Email**: `sid@hostelhub.app`
- **Password**: `password123`

---

## Technical Notes

### Frontend Connection
The frontend is already configured with an API client layer (`js/api.js`) that automatically connects to `http://localhost:3001/api`.

- **Connected Mode**: When the backend server is running, the frontend will communicate with it, fetch database records, write bookings/repairs, and mark alerts as read.
- **Static Fallback Mode**: If the backend server is not running, the frontend detects this and gracefully falls back to using the static mock data in `js/data.js`, so you can always preview and run the app locally without any server setup.
