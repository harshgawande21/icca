// 🔍 NETLIFY DEBUG SCRIPT
// Copy and paste this into your browser console on your Netlify site

console.log('🔍 ICCA Netlify Debug Script');
console.log('================================');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

if (!import.meta.env.VITE_API_URL) {
  console.error('❌ VITE_API_URL is not set!');
  console.log('🔧 Fix: Add VITE_API_URL to Netlify environment variables');
  console.log('   1. Go to Netlify dashboard → Your site');
  console.log('   2. Site settings → Environment variables');
  console.log('   3. Add: VITE_API_URL = https://your-backend.onrender.com/api');
  console.log('   4. Redeploy your site');
} else {
  console.log('✅ VITE_API_URL is configured');
  
  // Test backend connection
  console.log('');
  console.log('🔗 Testing Backend Connection...');
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const healthUrl = apiUrl.replace('/api', '/health');
  
  fetch(healthUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    })
    .then(data => {
      console.log('✅ Backend Health Check Successful:', data);
      
      // Test API endpoint
      console.log('');
      console.log('📧 Testing Templates API...');
      
      fetch(`${apiUrl}/templates`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        })
        .then(data => {
          console.log('✅ Templates API Working:', data.count || data.data?.length, 'templates found');
          console.log('');
          console.log('🎉 Backend is working correctly!');
          console.log('');
          console.log('🔧 If login still fails, check:');
          console.log('   1. CORS settings on backend');
          console.log('   2. JWT_SECRET is set on backend');
          console.log('   3. Database connection on backend');
        })
        .catch(error => {
          console.error('❌ Templates API Failed:', error.message);
          console.log('');
          console.log('🔧 Possible Issues:');
          console.log('   1. Backend not fully deployed');
          console.log('   2. Database not connected');
          console.log('   3. Environment variables missing on backend');
        });
    })
    .catch(error => {
      console.error('❌ Backend Health Check Failed:', error.message);
      console.log('');
      console.log('🔧 Backend Issues:');
      
      if (error.message.includes('CORS')) {
        console.log('   ❌ CORS Error: Backend doesn\'t allow this domain');
        console.log('   🔧 Fix: Add your Netlify URL to CORS_ORIGINS on backend');
        console.log('      CORS_ORIGINS=' + window.location.origin);
      } else if (error.message.includes('Failed to fetch')) {
        console.log('   ❌ Network Error: Backend not reachable');
        console.log('   🔧 Fix: Deploy backend to Render/Railway');
        console.log('   📖 Guide: Follow NETLIFY_DEPLOYMENT_FIX.md');
      } else if (error.message.includes('404')) {
        console.log('   ❌ Wrong URL: Backend not found at this address');
        console.log('   🔧 Fix: Check VITE_API_URL points to correct backend');
      } else {
        console.log('   ❌ Unknown Error:', error.message);
        console.log('   🔧 Fix: Check backend logs and deployment status');
      }
    });
}

// Check current page and auth state
console.log('');
console.log('📍 Current Page Info:');
console.log('URL:', window.location.href);
console.log('Domain:', window.location.origin);

// Check for auth token
const token = localStorage.getItem('icca_token');
console.log('🔐 Auth Token:', token ? 'Present' : 'Not found');

if (token) {
  console.log('ℹ️  You appear to be logged in locally');
  console.log('   If login page still shows, there might be a token validation issue');
}

console.log('');
console.log('📞 Need Help?');
console.log('   1. Share this console output');
console.log('   2. Check NETLIFY_DEPLOYMENT_FIX.md for solutions');
console.log('   3. Follow the step-by-step backend deployment guide');

console.log('');
console.log('🎯 Most Common Fixes:');
console.log('   1. Deploy backend to Render/Railway');
console.log('   2. Add VITE_API_URL to Netlify environment variables');
console.log('   3. Configure CORS on backend for your Netlify domain');
console.log('   4. Redeploy both frontend and backend after changes');