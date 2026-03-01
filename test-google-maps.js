// Simple Google Maps API test
const { Loader } = require('@googlemaps/js-api-loader');

async function testGoogleMaps() {
  try {
    console.log('Testing Google Maps API...');
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'demo-key';
    console.log('API Key:', apiKey);
    
    if (apiKey === 'your_google_maps_api_key_here' || apiKey === 'demo-key') {
      console.log('❌ No valid API key found');
      console.log('Please set a valid Google Maps API key in your .env.local file');
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly'
    });

    console.log('Loading Google Maps API...');
    const { Map } = await loader.importLibrary('maps');
    
    console.log('✅ Google Maps API is working!');
    console.log('Map library loaded successfully');
    
  } catch (err) {
    console.error('❌ Google Maps API failed:', err.message);
  }
}

testGoogleMaps();

