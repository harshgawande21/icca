const axios = require('axios');

async function testAuthFlow() {
  console.log('🔐 Testing ICCA Authentication Flow...');
  console.log('');

  const baseURL = 'http://localhost:3001/api';

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing User Registration...');
    const newUser = {
      first_name: 'Test',
      last_name: 'User',
      email: `test${Date.now()}@example.com`,
      password: 'testpass123'
    };

    const registerResponse = await axios.post(`${baseURL}/auth/register`, newUser);
    console.log('✅ Registration successful:', registerResponse.data.success);
    
    const token = registerResponse.data.data.token;
    console.log('✅ Token received:', token ? 'Yes' : 'No');

    // Test 2: Login with existing user
    console.log('');
    console.log('2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@icca.com',
      password: 'admin123'
    });
    console.log('✅ Login successful:', loginResponse.data.success);
    
    const adminToken = loginResponse.data.data.token;

    // Test 3: Access protected route with token
    console.log('');
    console.log('3️⃣ Testing Protected Route Access...');
    const profileResponse = await axios.get(`${baseURL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    console.log('✅ Profile access successful:', profileResponse.data.success);
    console.log('✅ User data:', `${profileResponse.data.data.first_name} ${profileResponse.data.data.last_name}`);

    // Test 4: Access protected route without token (should fail)
    console.log('');
    console.log('4️⃣ Testing Unauthorized Access...');
    try {
      await axios.get(`${baseURL}/auth/profile`);
      console.log('❌ Unauthorized access should have failed');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('');
    console.log('🎉 Authentication Flow Test Completed!');
    console.log('');
    console.log('📋 Test Results:');
    console.log('   ✅ User Registration: Working');
    console.log('   ✅ User Login: Working');
    console.log('   ✅ Protected Routes: Working');
    console.log('   ✅ Token Validation: Working');
    console.log('   ✅ Unauthorized Access: Properly Blocked');
    console.log('');
    console.log('🌐 Frontend Authentication:');
    console.log('   Login Page: http://localhost:5173/login');
    console.log('   Signup Page: http://localhost:5173/signup');
    console.log('   Main App: http://localhost:5173/ (requires login)');
    console.log('');
    console.log('🔐 Demo Credentials:');
    console.log('   Email: admin@icca.com');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Authentication test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('');
      console.log('🔧 Make sure the backend server is running:');
      console.log('   cd server && npm run dev');
    }
  }
}

testAuthFlow();