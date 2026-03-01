# 🗺️ Google Maps API Setup Guide

## Quick Setup for Farm Feed Maps

### 1. Get Your Google Maps API Key

1. **Go to Google Cloud Console**: https://console.cloud.google.com/google/maps-apis
2. **Create a new project** or select an existing one
3. **Enable the following APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. **Create credentials** (API Key)
5. **Copy your API key**

### 2. Configure Your Environment

Create a `.env.local` file in your project root:

```bash
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Security Best Practices

**Important**: Restrict your API key for security:

1. Go to **APIs & Services > Credentials**
2. Click on your API key
3. Under **Application restrictions**, select:
   - **HTTP referrers** for web applications
   - Add your domain: `localhost:3000/*` (for development)
   - Add your production domain: `yourdomain.com/*`
4. Under **API restrictions**, select:
   - **Restrict key** and choose only the APIs you need

### 4. Test Your Setup

1. **Start your development server**: `npm run dev`
2. **Navigate to**: `http://localhost:3000/maps`
3. **You should see**:
   - Interactive Google Maps
   - Markers for agricultural locations
   - Clickable markers with details
   - Sidebar with location information

### 5. Demo Mode

If you don't have an API key yet, the map will show an error message with instructions. This is normal and expected.

### 6. Features Available

- **Interactive Map**: Zoom, pan, and explore South Africa
- **Location Markers**: 
  - 🌾 Green: Product Listings
  - 🚛 Red: Transport Routes  
  - 📦 Blue: Backload Opportunities
- **Click Markers**: View detailed information
- **Sidebar**: Browse all locations
- **Responsive Design**: Works on desktop and mobile

### 7. Troubleshooting

**Map not loading?**
- Check your API key is correct
- Ensure the required APIs are enabled
- Check browser console for errors
- Verify your domain restrictions

**Getting quota errors?**
- Check your Google Cloud billing
- Monitor your API usage in the console
- Consider setting up billing alerts

### 8. Next Steps

Once your API key is working:
- The map will show real South African locations
- You can add more demo data
- Integrate with your actual database
- Add real-time updates
- Implement advanced filtering

---

**Need help?** Check the Google Maps documentation: https://developers.google.com/maps/documentation

