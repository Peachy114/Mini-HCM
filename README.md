# MiniHCM — Time Tracking System

A lightweight Human Capital Management (HCM) Time-In/Time-Out system built with Firebase, React.js, and Node.js/Express.

> ⚠️ **This is a test demo environment.** 

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Authentication | Firebase Auth (Email/Password) |

---

## Features

- **User Registration & Login** — Firebase Email/Password authentication
- **Punch In / Punch Out** — One punch per day, per employee
- **Auto Computation** on punch out:
  - Regular Hours (within scheduled shift)
  - Overtime (beyond shift end)
  - Night Differential (10 PM – 6 AM)
  - Late (arrived after shift start)
  - Undertime (left before shift end)
- **Daily Summary Dashboard** — Metrics displayed after each punch out
- **Attendance History** — Last 30 days of records
- **Admin Panel**:
  - View/edit employee punch records
  - Daily report with all metrics
  - Weekly report with aggregated totals and daily breakdown
  - Manage employees (view, edit schedule, role, timezone)

---

## Getting Started

### Prerequisites

- Node.js v18+
- Firebase project (Firestore + Authentication enabled)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd mini-hcm
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FRONTEND_URL=http://localhost:5173
```

> Get these values from Firebase Console → Project Settings → Service Accounts → Generate new private key.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
```

> Get these values from Firebase Console → Project Settings → General → Your apps.

Start the frontend:

```bash
npm run dev
```

---

## How to Use

### Register & Login

1. Go to `http://localhost:5173/register`
2. Fill in your name, email, password, and timezone
3. The **first registered user** is automatically assigned the **Admin** role
4. All subsequent users are assigned the **Employee** role
5. Login at `/login` — you will be redirected based on your role:
   - Admin → `/admin/dashboard`
   - Employee → `/dashboard`

---

### Setting Up an Admin Manually

If you need to manually promote a user to admin (e.g., for testing):

1. Go to **Firebase Console → Firestore Database**
2. Open the `users` collection
3. Find the user document by their UID
4. Change the `role` field from `"employee"` to `"admin"`
5. The user will have admin access on their next login

---

### Employee Workflow

1. **Login** → redirected to Employee Dashboard
2. **Clock In** — tap "Clock In" button to start your shift
3. **Clock Out** — tap "Clock Out" to end your shift and generate your daily summary
4. **View Summary** — Regular, OT, Night Diff, Late, Undertime, Total are displayed
5. **View History** — last 30 days of attendance records shown at the bottom

> One punch per day. Once you clock out, both buttons are disabled for the rest of the day.

---

### Admin Workflow

1. **Login** → redirected to Admin Dashboard
2. **Manage Employees** — view all employees and admins, edit their schedule, timezone, and role
3. **Daily Report** — select a date to view all employee punch records and metrics; edit punches if needed
4. **Weekly Report** — select a week start date to view aggregated totals per employee; expand rows to see daily breakdown

---

## Firestore Collections

| Collection | Description |
|---|---|
| `users` | User profiles (name, email, role, timezone, schedule) |
| `attendance` | Raw punch records (punchIn, punchOut, status, date) |
| `dailySummary` | Computed metrics per user per day |

---

## Default Schedule

All newly registered employees are assigned a default shift of **09:00 – 18:00**. Admins can update this via the **Manage Employees → Edit** page.

---

## Firestore Indexes Required

The following composite indexes must be created in Firebase Console → Firestore → Indexes:

| Collection | Fields | Order |
|---|---|---|
| `dailySummary` | `userId` ASC, `date` DESC | Composite |
| `attendance` | `userId` ASC, `date` ASC | Composite |

> Firebase will also prompt you with a direct link in the backend terminal when these are missing. Just click the link and it will create them automatically.


---

## Notes

- Punch times and hours are computed in **Asia/Manila (UTC+8)** timezone by default
- Night differential covers hours worked between **10:00 PM and 6:00 AM**
- Overtime is calculated as hours worked **beyond the scheduled shift end**
- Admin edits to punch records **automatically recompute** all metrics

---

## Resources & References

### Libraries & Frameworks

| Resource | Description | Link |
|---|---|---|
| React.js | Frontend UI library | https://react.dev |
| Vite | Frontend build tool | https://vitejs.dev |
| TailwindCSS | Utility-first CSS framework | https://tailwindcss.com |
| shadcn/ui | Accessible UI components built on Radix | https://ui.shadcn.com |
| date-fns | Modern JavaScript date utility library | https://date-fns.org |
| date-fns-tz | Timezone support for date-fns | https://github.com/marnusw/date-fns-tz |
| Node.js | JavaScript runtime for the backend | https://nodejs.org |
| Express.js | Minimal Node.js web framework | https://expressjs.com |
| Axios | Promise-based HTTP client | https://axios-http.com |
| Sonner | Toast notification library for React | https://sonner.emilkowal.ski |

### Firebase

| Resource | Description | Link |
|---|---|---|
| Firebase Console | Manage your Firebase project | https://console.firebase.google.com |
| Firebase Auth Docs | Email/Password authentication setup | https://firebase.google.com/docs/auth |
| Firestore Docs | NoSQL cloud database documentation | https://firebase.google.com/docs/firestore |
| Firebase Admin SDK | Server-side Firebase access | https://firebase.google.com/docs/admin/setup |

### Firebase Setup Guide

> Step-by-step instructions used to set up this project's Firebase configuration:
>
> 📖 **[Firebase Setup Guide — TeachMeIDEA](https://teachmeidea.com/firebase-setup-guide)**

---

*Built for VCI Assessment — MiniHCM Time Tracking Activity*