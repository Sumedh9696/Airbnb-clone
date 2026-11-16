# Airbnb Clone - Full Stack Backend API

Production-ready backend API for the Airbnb Clone Capstone platform, built with **Express.js**, **Sequelize (SQLite / PostgreSQL)**, and **JWT Authentication**.

---

## 🛠 Features & Module Deliverables

* **Module 1 (Backend Foundation):** Complete relational data model (`User`, `Listing`, `Booking`, `Review`), JWT auth middleware, role-based authorization (`guest`, `host`, `admin`), centralized error handling.
* **Module 2 (Listings & Search Support):** Search and filter by city/query, category, price range, bedrooms, guests, property type, sorting, and pagination.
* **Module 3 (Booking Engine):** Transactional write validation preventing double bookings (`existing.startDate < requested.endDate && existing.endDate > requested.startDate`).
* **Module 4 (Reviews & Host Dashboard):** Average review aggregation and host dashboard analytics (total revenue, listings count, reservations, recent guests).

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Demo Data
Populates the database with realistic hosts, guests, international listings, reviews, and bookings:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
# or
npm start
```
The API will run at `http://localhost:5000/api`.

### 4. Run Automated Tests
```bash
npm test
```

---

## 🔑 Demo Accounts (Pre-Seeded)

| Role | Email | Password |
|---|---|---|
| **Host (Superhost)** | `sarah.host@example.com` | `password123` |
| **Host** | `kenji.host@example.com` | `password123` |
| **Guest** | `alex.guest@example.com` | `password123` |
| **Guest** | `elena.guest@example.com` | `password123` |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new guest or host account.
* `POST /api/auth/login` — Sign in and receive a signed JWT.
* `GET /api/auth/me` — Get authenticated user profile *(Requires Bearer token)*.
* `PUT /api/auth/profile` — Update name, bio, avatar, or role *(Requires Bearer token)*.

### Listings (`/api/listings`)
* `GET /api/listings` — Search & filter listings:
  * Query parameters: `search`, `city`, `category`, `propertyType`, `minPrice`, `maxPrice`, `guests`, `bedrooms`, `sort`, `page`, `limit`.
* `GET /api/listings/:id` — Get listing details, host profile, and detailed reviews with rating breakdown.
* `POST /api/listings` — Create a new listing *(Host only)*.
* `PUT /api/listings/:id` — Update listing details *(Owner only)*.
* `DELETE /api/listings/:id` — Delete listing *(Owner only)*.

### Bookings (`/api/bookings`)
* `POST /api/bookings` — Create a reservation with strict conflict/overlap validation *(Requires Bearer token)*.
* `GET /api/bookings/my-bookings` — View logged-in user's bookings with listing details *(Requires Bearer token)*.
* `GET /api/bookings/listing/:listingId` — Get all booked date ranges for a listing (used by frontend date-picker).
* `PUT /api/bookings/:id/cancel` — Cancel a booking *(Guest or Host)*.

### Reviews (`/api/reviews`)
* `POST /api/reviews` — Leave a review and rating for a listing *(Guest only)*.
* `GET /api/reviews/listing/:listingId` — Fetch all reviews and aggregate rating for a listing.
* `DELETE /api/reviews/:id` — Delete a review *(Author only)*.

### Host Portal (`/api/host`)
* `GET /api/host/dashboard` — View host metrics: total listings, reservations, total earnings, and recent reservations *(Host only)*.
