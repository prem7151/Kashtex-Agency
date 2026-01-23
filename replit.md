# Kashtex - Professional Web Development Agency Website

## Overview
Kashtex is a production-ready website for a local website-building agency. The website features a modern sage/emerald green design, AI chatbot functionality, appointment booking with double-booking prevention, contact forms, and an admin panel with analytics.

## Recent Changes
- **Jan 23, 2026**: Refactored to pure static site with client-side Supabase integration
- Removed all serverless API routes to eliminate Node.js version conflicts
- Created client-side Supabase client with defensive fallbacks for local development
- Fixed all database field naming (snake_case: is_read, created_at, session_id, visitor_name, visitor_email)
- Updated DEPLOYMENT_GUIDE.md with simplified Vercel + Supabase instructions

## Project Architecture

### Frontend (client/)
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom sage/emerald theme
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **Database**: Supabase client (direct calls from browser)

### Backend
- **Architecture**: Static site with client-side Supabase integration
- **Database**: Supabase (PostgreSQL)
- **Authentication**: localStorage-based admin auth with bcrypt password verification

### Key Files
- `client/src/lib/supabase.ts` - Supabase client and all database functions
- `client/src/pages/admin/login.tsx` - Admin login with bcrypt verification
- `client/src/pages/admin/dashboard.tsx` - Admin panel with leads, appointments, chats, analytics
- `client/src/components/ui/chatbot.tsx` - AI chatbot that saves to Supabase
- `DEPLOYMENT_GUIDE.md` - Step-by-step deployment instructions

### Database Schema (Supabase)
All tables use snake_case column names:
- `users` - Admin accounts (username, password)
- `contacts` - Contact form submissions (is_read, created_at)
- `appointments` - Booking system (date, time, status, created_at)
- `chat_logs` - Chat conversations (session_id, messages, visitor_name, visitor_email, created_at)

## Key Features

### Public Features
- Modern responsive design with glassmorphism effects
- Contact form with validation
- Appointment booking with real-time availability checking
- AI chatbot for visitor engagement
- Services, Portfolio, About, Pricing pages

### Admin Features
- Login at `/admin/login` (admin / kashtex2026)
- Dashboard at `/admin/dashboard` showing:
  - Lead management (mark as read)
  - Appointment management (confirm/cancel)
  - Chat log review
  - Analytics with charts

## Deployment
Target: Vercel (static) + Supabase (database) + GoDaddy (kashtex.com domain)

### Environment Variables (Vercel)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_KEY` - Supabase anon public key

### Local Development
When Supabase credentials aren't configured, the app falls back to demo mode:
- Forms simulate successful submissions
- Admin login: admin / kashtex2026
- Dashboard shows empty data

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Contact Email
kashtex1@gmail.com
