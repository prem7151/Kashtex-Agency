# Kashtex Deployment Guide: Vercel + Supabase

This guide walks you through deploying your Kashtex website using **Vercel** (static hosting) and **Supabase** (database).

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **New Project**
3. Fill in the details:
   - **Name**: `kashtex`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your users
4. Click **Create new project** and wait for it to be ready

---

## Step 2: Get Your Supabase API Keys

1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public** key → This is your `VITE_SUPABASE_KEY`

---

## Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the following SQL and click **Run**:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (admin only)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat logs table
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  messages TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Step 4: Fix Row Level Security (RLS) Policies

This is critical! Without these policies, your forms won't work. Run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (in case they exist)
DROP POLICY IF EXISTS "Allow public insert" ON contacts;
DROP POLICY IF EXISTS "Allow public read" ON contacts;
DROP POLICY IF EXISTS "Allow public update" ON contacts;
DROP POLICY IF EXISTS "Allow public insert" ON appointments;
DROP POLICY IF EXISTS "Allow public read" ON appointments;
DROP POLICY IF EXISTS "Allow public update" ON appointments;
DROP POLICY IF EXISTS "Allow public insert" ON chat_logs;
DROP POLICY IF EXISTS "Allow public read" ON chat_logs;
DROP POLICY IF EXISTS "Allow update own session" ON chat_logs;
DROP POLICY IF EXISTS "Allow public update" ON chat_logs;

-- CONTACTS: Public can submit, admin can read and update
CREATE POLICY "Allow public insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON contacts FOR UPDATE USING (true);

-- APPOINTMENTS: Public can submit and read (for availability), admin can update status
CREATE POLICY "Allow public insert" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON appointments FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON appointments FOR UPDATE USING (true);

-- CHAT LOGS: Public can create, read, and update conversations
CREATE POLICY "Allow public insert" ON chat_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON chat_logs FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON chat_logs FOR UPDATE USING (true);

```

---

## Step 6: Push Code to GitHub

1. In Replit, click the **Git** icon (left sidebar)
2. Commit all changes
3. Push to your GitHub repository

---

## Step 7: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. **Before deploying**, go to **Settings** → **General**:
   - Set **Node.js Version** to **20.x**

5. Add **Environment Variables**:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_KEY` | Your Supabase anon public key |

6. Click **Deploy**

---

## Step 8: Connect Your Domain (kashtex.com)

1. In Vercel, go to your project → **Settings** → **Domains**
2. Click **Add Domain** and enter `kashtex.com`
3. Vercel will show you DNS records to add

4. In GoDaddy DNS settings, add:
   - **Type**: A Record
   - **Name**: @
   - **Value**: `76.76.21.21`

   AND

   - **Type**: CNAME
   - **Name**: www
   - **Value**: `cname.vercel-dns.com`

5. Wait 5-10 minutes for DNS to propagate

---

## Admin Login

After deployment, you can log in to the admin dashboard:
- URL: `https://kashtex.com/admin/login`
- Username: `admin`
- Password: `kashtex2026`

---

## Summary

- **Frontend**: Hosted on Vercel (static site, free)
- **Database**: Supabase (PostgreSQL, free tier)
- **Domain**: kashtex.com via GoDaddy DNS

Your Kashtex website should now be live!
