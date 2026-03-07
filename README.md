# PlayOrbit – On-Demand Turf Booking & Matchmaking Platform

PlayOrbit is a platform designed to simplify sports turf booking and player matchmaking. The system enables turf providers to manage their facilities and bookings while allowing players to discover turfs, reserve slots, create matches, and collaborate with other players through an approval-based matchmaking system.

---


# Project Overview

Urban sports communities often face challenges when booking turfs and coordinating games. Existing booking systems lack transparency in slot availability and rarely support structured player matchmaking.

PlayOrbit addresses these issues by providing:

- Real-time turf discovery
- Slot-based booking management
- Approval-based match participation
- Provider booking management
- Clean REST API architecture

The platform supports two primary roles:

### Providers
- Create and manage sports turfs
- Track bookings
- Monitor slot availability

### Players
- Discover turfs
- Book slots
- Create matches
- Send join requests to matches
- Join games through approval by match creators

---

# System Architecture

The backend follows a modular service architecture with clearly separated responsibilities.

```
Client (Frontend)
       |
       v
REST API (Express.js)
       |
       v
Controllers
       |
       v
Services / Business Logic
       |
       v
MongoDB (Mongoose ODM)
```


# Installation & Setup

Clone the repository:

```bash
git clone https://github.com/BhumikaYeole/PlayOrbit.git
cd PlayOrbit
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

# Running the Application

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---
# Key Features

## Turf Management
- Providers can create and manage turfs
- Slot availability tracking

## Turf Booking System
- Slot-based booking architecture
- Atomic database operations preventing double booking
- Booking cancellation with slot reopening
- Booking history for users
- Provider booking overview

## Player Matchmaking
- Players can create matches for booked slots
- Join requests sent to match creators
- Match creators approve or reject requests
- Match participation tracking
- Leave match functionality
- Match cancellation with database cleanup

## Concurrency Safe Design
- Atomic updates prevent race conditions during booking
- Transaction-based match deletion
- Data consistency between bookings, slots, and matches

---
