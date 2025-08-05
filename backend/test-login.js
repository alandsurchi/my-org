// Test Login Script
const API_BASE = 'http://localhost:5000/api';

async function testLogin() {
  console.log('🔑 Testing admin login...\n');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@charity.org',
        password: 'admin123'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('🎫 JWT Token received');
      console.log('👤 User:', data.user);
      console.log('\n🔗 Token (first 50 chars):', data.token.substring(0, 50) + '...');
      
      // Test creating sample news with the token
      console.log('\n📰 Testing news creation...');
      const newsResponse = await fetch(`${API_BASE}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify({
          title: 'Welcome to Our Charity Dashboard!',
          content: 'This is your first news article created through the API. You can now manage all your charity content through this powerful backend system.',
        })
      });

      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        console.log('✅ Sample news created successfully!');
        console.log('📰 Title:', newsData.title);
        console.log('📅 Created:', new Date(newsData.createdAt).toLocaleString());
      }

    } else {
      const error = await response.json();
      console.log('❌ Login failed:', error.message);
    }
  } catch (error) {
    console.log('❌ Error during login test:', error.message);
  }
}

testLogin();
