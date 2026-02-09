# Kashtex - Professional Web Development Agency Website

## Overview
Kashtex is a production-ready website for a local website-building agency. The website features a modern sage/emerald green design, AI chatbot functionality, appointment booking with double-booking prevention, contact forms, email notifications, and an admin panel with analytics.

## Recent Changes
- **Feb 9, 2026**: Switched frontend back to Express backend API routes (from direct Supabase calls)
- Admin panel now uses server-side session authentication via Passport.js
- Email notifications via Resend send to kashtex1@gmail.com on contact form submissions and appointment bookings
- Added proper session validation in admin dashboard

## Project Architecture

### Frontend (client/)
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom sage/emerald theme
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **API Calls**: fetch() to Express backend endpoints

### Backend (server/)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy + express-session
- **Session Store**: PostgreSQL via connect-pg-simple
- **Email**: Resend integration via Replit connector

### Database Schema (shared/schema.ts)
- `users` - Admin accounts (username, password with bcrypt hashing)
- `contacts` - Contact form submissions (isRead, createdAt)
- `appointments` - Booking system with double-booking prevention (date, time, status)
- `chatLogs` - AI chatbot conversation history (sessionId, messages, visitorName, visitorEmail)
- `sessions` - Auth session storage

### Key Files
- `server/routes.ts` - All API routes (auth, contacts, appointments, chat logs)
- `server/storage.ts` - Database CRUD operations via Drizzle ORM
- `server/resend.ts` - Email notification functions
- `client/src/pages/contact.tsx` - Contact form + appointment booking
- `client/src/pages/admin/login.tsx` - Admin login
- `client/src/pages/admin/dashboard.tsx` - Admin panel with leads, appointments, chats, analytics
- `client/src/components/ui/chatbot.tsx` - AI chatbot

## API Endpoints

### Public
- `POST /api/contacts` - Submit contact form (sends email notification)
- `POST /api/appointments` - Book appointment (sends email notification)
- `GET /api/appointments/available?date=YYYY-MM-DD` - Get available time slots
- `PATCH /api/chat-logs/:sessionId` - Create/update chat conversation

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

## Admin Credentials
- Username: admin
- Password: kashtex2026

## Email Notifications
- Powered by Resend via Replit integration
- Sends to: kashtex1@gmail.com
- Triggered on: contact form submissions and appointment bookings

## Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database
- `npm run build` - Build for production

## Contact Email
kashtex1@gmail.com
