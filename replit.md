# Kashtex - Professional Web Development Agency Website

## Overview
Kashtex is a production-ready website for a local website-building agency that provides full-stack development services to small and medium businesses. The website features a modern design with a sage/emerald green color palette, AI chatbot functionality, appointment booking system, contact forms, and an admin panel.

## Project Architecture

### Frontend (client/)
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom sage/emerald theme
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy + express-session
- **Session Store**: PostgreSQL via connect-pg-simple

### Database Schema (shared/schema.ts)
- `users` - Admin accounts
- `contacts` - Contact form submissions (leads)
- `appointments` - Booking system with double-booking prevention
- `chatLogs` - AI chatbot conversation history
- `sessions` - Auth session storage

## Key Features

### Public Features
- Modern responsive design with glassmorphism effects
- Contact form with validation
- Appointment booking with real-time availability checking
- AI chatbot for visitor engagement (conversations saved to database)
- Services, Portfolio, About, Pricing pages

### Admin Features
- Secure login at `/admin/login`
- Dashboard at `/admin/dashboard` showing:
  - Lead management (mark as read)
  - Appointment management (confirm/cancel)
  - Chat log review
  - Settings

## Admin Setup
The admin account is created on first run via `POST /api/admin/setup`. Default credentials should be changed after initial setup for production use.

## API Endpoints

### Public
- `POST /api/contacts` - Submit contact form
- `POST /api/appointments` - Book appointment
- `GET /api/appointments/available?date=YYYY-MM-DD` - Get available time slots
- `POST /api/chat-logs` - Create chat session
- `PATCH /api/chat-logs/:sessionId` - Update chat conversation

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Check auth status

### Admin (requires auth)
- `GET /api/admin/contacts` - List all leads
- `PATCH /api/admin/contacts/:id/read` - Mark contact as read
- `GET /api/admin/appointments` - List all appointments
- `PATCH /api/admin/appointments/:id/status` - Update appointment status
- `GET /api/admin/chat-logs` - List chat conversations

## Pending Features

### Email Notifications
Email notifications to kashtex1@gmail.com are not yet configured. To enable:
1. Set up Resend integration OR
2. Add `RESEND_API_KEY` secret and implement email sending in `/server/routes.ts`

Notifications should be sent for:
- New contact form submissions
- New appointment bookings

## Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database
- `npm run build` - Build for production

## Contact Email
kashtex1@gmail.com
