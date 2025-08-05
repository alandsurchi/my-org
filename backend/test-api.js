#!/usr/bin/env node

// Simple API Test Script
// Run this to test your backend API endpoints

const API_BASE = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Charity Dashboard API...\n');

  // Test 1: Root endpoint
  try {
    console.log('1. Testing root endpoint...');
    const response = await fetch(`${API_BASE}/`);
    const data = await response.json();
    console.log('✅ Root endpoint:', data.message);
  } catch (error) {
    console.log('❌ Root endpoint failed:', error.message);
  }

  // Test 2: News endpoint
  try {
    console.log('\n2. Testing news endpoint...');
    const response = await fetch(`${API_BASE}/api/news`);
    const data = await response.json();
    console.log('✅ News endpoint: Retrieved', data.length, 'news items');
  } catch (error) {
    console.log('❌ News endpoint failed:', error.message);
  }

  // Test 3: Projects endpoint
  try {
    console.log('\n3. Testing projects endpoint...');
    const response = await fetch(`${API_BASE}/api/projects`);
    const data = await response.json();
    console.log('✅ Projects endpoint: Retrieved', data.length, 'projects');
  } catch (error) {
    console.log('❌ Projects endpoint failed:', error.message);
  }

  // Test 4: Gallery endpoint
  try {
    console.log('\n4. Testing gallery endpoint...');
    const response = await fetch(`${API_BASE}/api/gallery`);
    const data = await response.json();
    console.log('✅ Gallery endpoint: Retrieved', data.length, 'photos');
  } catch (error) {
    console.log('❌ Gallery endpoint failed:', error.message);
  }

  // Test 5: Hero endpoint
  try {
    console.log('\n5. Testing hero endpoint...');
    const response = await fetch(`${API_BASE}/api/hero`);
    if (response.status === 404) {
      console.log('✅ Hero endpoint: No hero image set (expected)');
    } else {
      const data = await response.json();
      console.log('✅ Hero endpoint: Hero image found');
    }
  } catch (error) {
    console.log('❌ Hero endpoint failed:', error.message);
  }

  console.log('\n🎉 API testing completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Configure your MongoDB connection in .env');
  console.log('2. Create your first admin user');
  console.log('3. Start uploading content through the API');
}

// Run the test
testAPI().catch(console.error);
