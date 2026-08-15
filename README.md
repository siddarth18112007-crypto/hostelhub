# HostelHub — Personal Hostel Operating System

HostelHub is a premium personal hostel operating system designed for students, wardens, and maintenance crew. It streamlines room configuration, mess scheduling, laundry slots booking, repair orders tracking, events management, and shared resources reservation.

---

## 🚀 Demo Logins (Try them out!)
Use the following credentials in the login page helper cards to instantly explore the different role views:

| Role | Email / ID | Password | Main Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `sid@hostelhub.app` | `password123` | Book laundry, file repairs, register for events, check schedules. |
| **Warden / Admin** | `warden@hostelhub.app` | `password123` | Assign repairs, edit menus, publish notices, create events, toggle facilities. |
| **Staff / Technician** | `staff@hostelhub.app` | `password123` | View assigned repairs, update maintenance steps, close tickets. |

---

## 📂 Project Structure

### 1. Frontend Web App (Standalone Single-Page Prototype)
The frontend is built using standard responsive **HTML5, CSS3, and JavaScript**, structured as a client-side Single Page Application (SPA) with a custom hash-router.

It contains a **LocalStorage database simulator** inside `js/api.js` that mirrors all database operations locally. Any changes you make (booking laundry, assigning staff, updating repair stages, publishing notices) are **100% persistent** inside your browser across reloads!

* **[`index.html`](file:///d:/hostelhub/hostelhub/index.html)**: Main entry point linking styles and page scripts.
* **[`css/`](file:///d:/hostelhub/hostelhub/css/)**: Styling variables, custom components, layouts, and page theme definitions.
* **[`js/api.js`](file:///d:/hostelhub/hostelhub/js/api.js)**: LocalStorage-backed state mutation client & offline fallback simulator.
* **[`js/router.js`](file:///d:/hostelhub/hostelhub/js/router.js)**: SPA navigation, dynamic headers, transition triggers, and badge updates.
* **[`js/pages/`](file:///d:/hostelhub/hostelhub/js/pages/)**: Specialized views (e.g. `home.js`, `alerts.js`, `admin.js`, `staff.js`, `laundry.js`, `repair.js`).

---

### 2. Backend API Server (`server/`)
A modular production-ready REST API built with **Node.js, TypeScript, Express, and PostgreSQL** (mapped using **Prisma ORM**).

* **[`server/prisma/schema.prisma`](file:///d:/hostelhub/hostelhub/server/prisma/schema.prisma)**: PostgreSQL relational schemas (User, Role enum, Rooms, Bookings, Repairs, Notices, etc.).
* **[`server/prisma/seed.ts`](file:///d:/hostelhub/hostelhub/server/prisma/seed.ts)**: Seeder script to auto-generate mock credentials and baseline database states.
* **[`server/src/app.ts`](file:///d:/hostelhub/hostelhub/server/src/app.ts)**: REST endpoints definitions, JWT parses, and permissions validations.
* **[`server/src/middleware/auth.ts`](file:///d:/hostelhub/hostelhub/server/src/middleware/auth.ts)**: Role-based route guards and verification rules.
* **[`server/src/server.ts`](file:///d:/hostelhub/hostelhub/server/src/server.ts)**: Boot listener binding to the specified PORT.

---

## 🛠️ Installation & Setup (Production Server)

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org) database running locally or in the cloud.

### 1. Database Setup
Create a PostgreSQL database named `hostelhub`. Copy `server/.env.example` to `server/.env` and update the connection URL:
```env
DATABASE_URL="postgresql://postgres:password123@localhost:5432/hostelhub?schema=public"
JWT_SECRET="super-secret-hostelhub-token-signing-key-1024"
PORT=3001
```

### 2. Install Server Dependencies
Open a command prompt in the `server` directory:
```bash
cd server
npm install
```

### 3. Run Prisma Migrations & Seed Database
Create tables in PostgreSQL and load the initial demo dataset:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Start Server
Run in development reload mode:
```bash
npm run dev
```
Or build and run in production:
```bash
npm run build
npm start
```

---

## 📡 REST API Endpoint Documentation

### Auth Module
* `POST /api/auth/login` - Authenticate using email and password. Returns JWT token.
* `GET /api/student/profile` - Fetch authenticated user profile details.

### Mess Module
* `GET /api/services/mess/menu` - Fetch weekly mess menus.
* `PUT /api/services/mess/menu` - Update menu slots items (Admin only). Broadcasts alerts.

### Laundry Module
* `GET /api/services/laundry/slots` - Fetch bookings for the logged-in student.
* `POST /api/services/laundry/book` - Reserve machine slot date & time (validates conflicts).

### Repair Module
* `GET /api/services/repair/active` - Fetch current active repair tracking stages.
* `POST /api/services/repair/new` - File a new maintenance repair request ticket.
* `PUT /api/services/repair/assign` - Assign technician, scheduled time, and priority level (Admin only).
* `PUT /api/services/repair/update` - Update progress stage reported/assigned/completed (Staff only).

### Shared Resources & Notices
* `GET /api/services/resources` - Fetch availability list of facilities.
* `POST /api/services/resources/reserve` - Lock a slot reservation for gym/study room.
* `POST /api/notifications/notices/new` - Publish global broadcast notices (Admin only).

---

## 🧪 Frontend Testing
To open and test the complete frontend standalone application immediately:
1. Open [`index.html`](file:///d:/hostelhub/hostelhub/index.html) directly in any web browser.
2. Select any of the **Demo Logins** helpers at the bottom of the login screen to enter the respective dashboard.
3. Test persistent workflows (e.g. book a laundry slot, submit a repair ticket, switch to Admin to assign it, check Staff dashboard to advance stages, and watch the updates reflect instantly!).