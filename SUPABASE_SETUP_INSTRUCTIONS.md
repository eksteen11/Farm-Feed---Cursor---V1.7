# 🚀 Farm Feed V1.7 - Supabase Database Setup Guide

This guide will help you set up your Supabase database for Farm Feed V1.7.

## 📋 Prerequisites

1. A Supabase account (https://supabase.com)
2. A Supabase project created (Farm Feed V1.7)
3. Access to your Supabase dashboard

## 🔧 Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/lormmzqxqxpnftyfwzym
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

## 🔐 Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lormmzqxqxpnftyfwzym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**⚠️ Important:** 
- Never commit `.env.local` to git (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix makes variables available to the browser
- The service role key should only be used server-side

## 🗄️ Step 3: Run Database Setup Script

1. Open your Supabase dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file `supabase/COMPLETE_DATABASE_SETUP.sql` from this project
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** (or press `Cmd/Ctrl + Enter`)

The script will:
- ✅ Create all required tables (users, products, listings, offers, deals, messages, notifications, transport_requests, transport_quotes)
- ✅ Set up indexes for performance
- ✅ Configure Row Level Security (RLS) policies
- ✅ Create triggers for automatic timestamp updates
- ✅ Insert sample product data

## ✅ Step 4: Verify Setup

### Option A: Using the Test Script

Run the connection test script:

```bash
node scripts/test-supabase-connection.js
```

This will test all tables and verify your connection.

### Option B: Manual Verification

1. Go to **Table Editor** in your Supabase dashboard
2. Verify these tables exist:
   - ✅ `users`
   - ✅ `products`
   - ✅ `listings`
   - ✅ `offers`
   - ✅ `deals`
   - ✅ `messages`
   - ✅ `notifications`
   - ✅ `transport_requests`
   - ✅ `transport_quotes`

3. Check that `products` table has sample data (8 products)

## 🧪 Step 5: Test Your Application

1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000/api/test-supabase` to test the connection

3. Try registering a new user to test authentication

## 📊 Database Schema Overview

### Core Tables

- **users** - User profiles with capabilities, FICA status, subscriptions
- **products** - Product catalog (maize, wheat, etc.)
- **listings** - Product listings created by sellers
- **offers** - Offers made by buyers on listings
- **deals** - Completed transactions between buyers and sellers
- **messages** - Communication between users
- **notifications** - In-app notifications
- **transport_requests** - Transport requests for deliveries
- **transport_quotes** - Quotes from transporters

### Key Features

- **Row Level Security (RLS)** - Users can only access their own data
- **Automatic Timestamps** - `created_at` and `updated_at` are managed automatically
- **Foreign Key Constraints** - Data integrity is enforced
- **Indexes** - Optimized queries for performance

## 🔒 Security Notes

- All tables have RLS enabled
- Users can only read/write their own data
- Public data (listings, products) is readable by all
- Service role key bypasses RLS (use only server-side)

## 🐛 Troubleshooting

### Error: "relation does not exist"
- Make sure you ran the `COMPLETE_DATABASE_SETUP.sql` script
- Check that you're connected to the correct Supabase project

### Error: "permission denied"
- Check your RLS policies are set correctly
- Verify your environment variables are correct
- Make sure you're using the anon key (not service role) for client-side operations

### Error: "invalid API key"
- Verify your environment variables in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your Next.js dev server after changing `.env.local`

### Tables not showing in Table Editor
- Refresh the page
- Check you're in the correct project
- Verify the SQL script ran without errors

## 📚 Next Steps

1. ✅ Database setup complete
2. ✅ Test connection verified
3. 🎯 Create your first user account
4. 🎯 Create your first listing
5. 🎯 Test the offer system

## 🆘 Need Help?

- Check the Supabase documentation: https://supabase.com/docs
- Review the project rules in `PROJECT_RULES.md`
- Check existing migrations in `supabase/migrations/`

---

**Setup completed!** Your Farm Feed V1.7 database is ready to use. 🎉








