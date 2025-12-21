// Test login API directly
const testLogin = async () => {
  try {
    const response = await fetch('https://icca-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@icca.com',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('User:', data.data.user.first_name, data.data.user.last_name);
    } else {
      console.log('❌ Login failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testLogin();