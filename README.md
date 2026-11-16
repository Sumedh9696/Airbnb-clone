# Airbnb Clone (Full Stack Capstone)

A full-stack Airbnb clone built following the 5-module capstone specification:
- **Module 1 (Backend Foundation):** Express.js REST API with Sequelize ORM, SQLite/PostgreSQL, and JWT Authentication.
- **Module 2 (Listings & Search UI):** Responsive React grid, category filtering, and destination/price search modal.
- **Module 3 (Booking Engine):** Transactional reservation engine with client-side & database-level overlap validation.
- **Module 4 (Maps, Reviews & Host Dashboard):** Interactive Leaflet maps with custom price pill markers, review submission & category rating aggregation, and Host dashboard.
- **Module 5 (Polish & Production Readiness):** Environment configuration separation, Vite production build, and automated tests.

---

## 📂 Project Structure

```
airbnb-clone/
├── backend/                  <-- Express.js + Sequelize REST API
│   ├── src/
│   │   ├── config/           <-- Database connection (db.js)
│   │   ├── controllers/      <-- Auth, Listing, Booking, Review, Host controllers
│   │   ├── middleware/       <-- JWT protect & role authorize guards
│   │   ├── models/           <-- User, Listing, Booking, Review
│   │   ├── routes/           <-- API route handlers
│   │   └── seeders/          <-- Database seeder (seed.js)
│   ├── test/                 <-- 10 passing automated tests (api.test.js)
│   └── database.sqlite       <-- Pre-seeded database
└── frontend/                 <-- React 18 + Vite SPA
    ├── src/
    │   ├── components/       <-- Navbar, Categories, Card, MapView, BookingWidget, Reviews
    │   ├── context/          <-- AuthContext (login, logout, user state)
    │   ├── pages/            <-- HomePage, ListingDetailPage, Login, Register, Trips, Host
    │   ├── services/         <-- Axios client with auth interceptors
    │   └── index.css         <-- Airbnb-inspired design system
    └── dist/                 <-- Production build
```

---

## 🚀 Running the Project

### Terminal 1: Start the Backend API
```bash
cd backend
npm run dev
```
Backend will run at `http://localhost:5000/api`.

### Terminal 2: Start the Frontend UI
```bash
cd frontend
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

## 🔑 Pre-Seeded Demo Credentials

| Role | Email | Password | What You Can Test |
|---|---|---|---|
| **Host** | `sarah.host@example.com` | `password123` | View Host Dashboard, see reservations, create & delete listings |
| **Host** | `kenji.host@example.com` | `password123` | Host view and earnings |
| **Guest** | `alex.guest@example.com` | `password123` | Book stays, test date-picker conflict validation, leave reviews |
| **Guest** | `elena.guest@example.com` | `password123` | Explore places and view booked trips |
