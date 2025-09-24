# Fix Supabase Email Verification URLs

## The Problem
Email verification links are pointing to `localhost:3000` instead of your production URL.

## The Solution
Update the Site URL in your Supabase project settings.

## Steps to Fix:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your Farm Feed project

2. **Navigate to Authentication Settings:**
   - Click **"Authentication"** in the left sidebar
   - Click **"Settings"**

3. **Update Site URL:**
   - Find **"Site URL"** field
   - Change from: `http://localhost:3000`
   - Change to: `https://farm-feed-cursor-v1-7.vercel.app`

4. **Update Redirect URLs:**
   - In the same settings, find **"Redirect URLs"**
   - Add: `https://farm-feed-cursor-v1-7.vercel.app`
   - You can keep `http://localhost:3000` for local development

5. **Save Changes:**
   - Click **"Save"** at the bottom

## What This Fixes:
- ✅ Email verification links will go to your production app
- ✅ Users can verify their emails and access the dashboard
- ✅ Proper user session management
- ✅ No more wrong user dashboard issues

## Test After Fix:
1. Register a new user in production
2. Check the verification email
3. Click the link - should go to your production app
4. Should see the correct user dashboard
