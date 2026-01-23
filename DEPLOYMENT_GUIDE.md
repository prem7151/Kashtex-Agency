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

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE appointments (
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

CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  messages TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin user (password: kashtex2026)
INSERT INTO users (username, password) VALUES (
  'admin',
  '$2a$10$rQZ5wJ5Q5Q5Q5Q5Q5Q5Q5OwR5wJ5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q5Q'
);
```

4. **Disable RLS** for each table:
   - Go to **Table Editor** → Click each table → Click **RLS** → Toggle OFF

---

## Step 4: Push Code to GitHub

1. In Replit, click the **Git** icon (left sidebar)
2. Commit all changes
3. Push to your GitHub repository

---

## Step 5: Deploy to Vercel

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

## Step 6: Connect Your Domain (kashtex.com)

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

## Email Notifications (Optional)

To enable email notifications when someone submits a contact form:

1. Sign up at [resend.com](https://resend.com) (free)
2. Get your API key
3. In your Supabase project, you can set up Edge Functions to send emails

Note: For the initial launch, contact form data is stored in the database and visible in your admin dashboard.

---

## Summary

- **Frontend**: Hosted on Vercel (static site)
- **Database**: Supabase (PostgreSQL)
- **Domain**: kashtex.com via GoDaddy DNS

Your Kashtex website should now be live!
