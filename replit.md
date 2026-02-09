# Kashtex - Professional Web Development Agency Website

## Overview
Kashtex is a production-ready website for a local website-building agency. The website features a modern sage/emerald green design, AI chatbot functionality, appointment booking with double-booking prevention, contact forms, and an admin panel with analytics.

## Recent Changes
- **Feb 9, 2026**: Switched frontend to use Supabase directly (client-side) for free Vercel+Supabase hosting
- All frontend pages use Supabase client functions from `client/src/lib/supabase.ts`
- Admin authentication uses localStorage + bcrypt password verification against Supabase `users` table
- Database hosted on Supabase (PostgreSQL) with RLS policies for security

## Project Architecture

### Frontend (client/)
- **Framework**: React 19 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with custom sage/emerald theme
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **Database**: Supabase client (`@supabase/supabase-js`) - direct calls from frontend

### Backend (server/)
- Express.js serves the frontend in dev mode (Vite dev server proxy)
- In production (Vercel), no backend needed - frontend calls Supabase directly

### Database (Supabase)
- `users` - Admin accounts (username, password with bcrypt hashing)
- `contacts` - Contact form submissions (is_read, created_at)
- `appointments` - Booking system with double-booking prevention (date, time, status)
- `chat_logs` - AI chatbot conversation history (session_id, messages, visitor_name, visitor_email)
- **Field naming**: snake_case in database and Supabase responses

### Key Files
- `client/src/lib/supabase.ts` - Supabase client + all database functions
- `client/src/pages/contact.tsx` - Contact form + appointment booking
- `client/src/pages/admin/login.tsx` - Admin login (bcrypt verification)
- `client/src/pages/admin/dashboard.tsx` - Admin panel with leads, appointments, chats, analytics
- `client/src/components/ui/chatbot.tsx` - AI chatbot
- `DEPLOYMENT_GUIDE.md` - Full deployment instructions for Vercel + Supabase

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_KEY` - Supabase anon public key

## Admin Credentials
- Username: admin
- Password: kashtex2026

## Deployment
- **Frontend hosting**: Vercel (free static hosting)
- **Database**: Supabase (free tier PostgreSQL)
- **Domain**: kashtex.com via GoDaddy DNS → Vercel

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production

## Contact Email
kashtex1@gmail.com
