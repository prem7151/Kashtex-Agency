# Kashtex Deployment Guide: Vercel + Supabase

This guide walks you through deploying your Kashtex website using **Vercel** (frontend + serverless API) and **Supabase** (database).

---

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **New Project**
3. Fill in the details:
   - **Name**: `kashtex`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest to your users
4. Click **Create new project** and wait for it to be ready (about 2 minutes)

---

## Step 2: Get Your Supabase API Keys

1. In your Supabase project, go to **Settings** (gear icon) → **API**
2. Copy these two values:
   - **Project URL** → This is your `SUPABASE_URL`
   - **anon public** key → This is your `SUPABASE_KEY`

Save these somewhere safe - you'll need them for Vercel.

---

## Step 3: Create Database Tables

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the following SQL and click **Run**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for admin authentication)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table (contact form submissions)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table (booking system)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat logs table (AI chatbot conversations)
CREATE TABLE chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  messages TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_chat_logs_session ON chat_logs(session_id);
```

4. Verify tables were created by clicking **Table Editor** in the sidebar

5. **Disable Row Level Security (RLS)** for each table:
   - Go to **Table Editor**
   - Click on each table (users, contacts, appointments, chat_logs)
   - Click the **RLS** button at the top
   - Toggle OFF "Enable RLS" or add a policy that allows all operations

   > **Note**: For production, you should create proper RLS policies instead of disabling RLS. This is just for initial setup.

---

## Step 4: Push Code to GitHub

1. Create a new repository on [github.com](https://github.com)
2. In your Replit project, open the Shell and run:

```bash
git remote add github https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push github main
```

Or download the project and push it manually.

---

## Step 5: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/log in with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`

5. Click **Environment Variables** and add:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_KEY` | Your Supabase anon public key |
| `JWT_SECRET` | A random string (32+ characters) |
| `RESEND_API_KEY` | Get from [resend.com](https://resend.com) (free) |
| `RESEND_FROM_EMAIL` | `Kashtex <onboarding@resend.dev>` |

6. Click **Deploy**

---

## Step 6: Create Admin Account

After deployment, you need to create the admin account:

1. Open your browser's developer console (F12)
2. Run this command (replace YOUR_DOMAIN with your Vercel URL):

```javascript
fetch('https://YOUR_DOMAIN/api/admin/setup', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

3. This creates an admin account:
   - **Username**: `admin`
   - **Password**: `kashtex2026`

---

## Step 7: Connect Your Custom Domain

1. In Vercel, go to your project → **Settings** → **Domains**
2. Click **Add Domain** and enter `kashtex.com`
3. Vercel will show you DNS records to add

4. Go to GoDaddy DNS settings and add:
   - **Type**: CNAME
   - **Name**: @ (or leave blank)
   - **Value**: `cname.vercel-dns.com`

5. Wait 5-10 minutes for DNS to propagate

---

## Troubleshooting

### Build fails
- Check Vercel build logs for specific errors
- Ensure all environment variables are set correctly

### Database connection fails
- Verify SUPABASE_URL and SUPABASE_KEY are correct
- Check that tables were created successfully in Supabase

### Admin login doesn't work
- Run the admin setup command from Step 6
- Check browser console for errors

### Emails not sending
- Get a free API key from [resend.com](https://resend.com)
- Add RESEND_API_KEY to Vercel environment variables

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_KEY` | Yes | Supabase anon/public API key |
| `JWT_SECRET` | Yes | Secret for JWT token signing (32+ chars) |
| `RESEND_API_KEY` | No | For email notifications |
| `RESEND_FROM_EMAIL` | No | Sender email address |

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs (Database → Logs)
3. Verify all environment variables are set

Your Kashtex website should now be live at your custom domain!
