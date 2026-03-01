# ⚡ Quick Start - Database Setup

## 🎯 3-Step Setup (5 minutes)

### 1️⃣ Get Your Keys
Visit: https://supabase.com/dashboard/project/lormmzqxqxpnftyfwzym/settings/api
- Copy **Project URL**
- Copy **anon public** key
- Copy **service_role** key

### 2️⃣ Create `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://lormmzqxqxpnftyfwzym.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyClTW5STgin9Smbjaq43YQEL7Pxsjx7ZfE
```

### 3️⃣ Run SQL Script
1. Open: https://supabase.com/dashboard/project/lormmzqxqxpnftyfwzym/sql/new
2. Open file: `supabase/COMPLETE_DATABASE_SETUP.sql`
3. Copy ALL content
4. Paste in SQL Editor
5. Click **Run** ✅

## ✅ Verify It Works

```bash
# Test connection
node scripts/test-supabase-connection.js

# Or start dev server
npm run dev
# Visit: http://localhost:3000/api/test-supabase
```

## 📋 What Gets Created

- ✅ 9 database tables
- ✅ 8 sample products
- ✅ Security policies (RLS)
- ✅ Performance indexes
- ✅ Auto-update triggers

**Done!** Your database is ready. 🚀








