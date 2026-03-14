

# IoT Stress Monitoring System - Implementation Plan

## Overview
A clinical, data-driven React frontend for monitoring stress levels via IoT sensors, connecting to a Spring Boot backend API.

## Pages & Features

### 1. Login Page
- Centered card (max-width 400px) with username and password fields
- Calls `POST /api/auth/login` — on success, stores auth state and redirects to Dashboard
- Link to Register page

### 2. Register Page
- Centered card with fields: username, email, phone number, password
- Calls `POST /api/auth/register` — on success, redirects to Login with success toast
- Link back to Login

### 3. Dashboard Page
- **3-column responsive grid** displaying big-number cards for:
  - Heart Rate (BPM)
  - GSR Value
  - Stress Level (with color-coded badge: green "NORMAL" / red "HIGH" + text label)
- **Submit sensor data form** to `POST /api/sensor/data`
- Button to navigate to History page
- Protected route (redirects to Login if not authenticated)

### 4. History Page
- Full-width data table with zebra-striping
- Columns: ID, Heart Rate, GSR Value, Stress Level (color-coded with text)
- Fetches from `GET /api/sensor/get`
- Protected route

## Shared Components

### Navbar
- Fixed top bar (white background, subtle border)
- Links: Dashboard | History | Logout button
- Logout clears auth state and redirects to Login

## API Layer
- Axios instance configured with `baseURL: http://localhost:8081/api`
- Auth service (login, register)
- Sensor service (post data, get history)
- Simple auth context storing login state in localStorage

## Design
- **Font:** Inter from Google Fonts
- **Colors:** Blue primary (#2563EB), slate background (#F8FAFC), white cards, deep navy text
- **Light mode only** — clean, medical aesthetic
- **Motion:** 200ms opacity fades for page transitions
- No dark mode, no heavy shadows/gradients

