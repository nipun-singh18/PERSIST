# PERSIST

### Personal Consistency & Progress Tracker

PERSIST is a full-stack web application designed to help users build consistency, track daily activities, maintain streaks, and visualize their progress over time.

## 🎯 Purpose

The main idea behind PERSIST is simple:

> Consistency is built one day at a time.

Users can create activities they want to stay consistent with, mark them as completed each day, and track their current and best streaks.

## ✨ Current Status: Frontend Functional (Temporary Storage)

The frontend is fully functional using `localStorage` as a temporary stand-in for a real backend. This includes:

- User signup and login (name, email, password stored client-side)
- Route protection (dashboard/profile redirect to login if not authenticated)
- Creating, completing, and removing activities
- Real streak calculation — current streak and best streak, computed from actual completion dates, not hardcoded
- Weekly consistency view driven by real completion history
- Dashboard and Profile pages stay in sync, sharing one streak-calculation module (`streaks.js`)
- Homepage adapts based on login state

**Known limitation:** since everything currently lives in the browser's `localStorage`, data does not persist across devices or browsers, and there is no real security (passwords are stored in plain text client-side). This is intentional for this stage of development — the next milestone replaces this with a real Spring Boot + MySQL backend.

## 🛠️ Tech Stack

### Frontend (current)
- HTML, CSS, JavaScript
- React (planned rewrite)

### Backend (planned)
- Java, Spring Boot
- REST APIs for auth, activities, and completions

### Database (planned)
- MySQL
- Tables: Users, Activities, Completions
- JPA / Hibernate

### Tools
- Git, GitHub, Postman

## 🏗️ Architecture