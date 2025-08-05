// Create Admin User Script
const API_BASE = 'http://localhost:5000/api';

async function createAdminUser() {
  console.log('🔐 Creating admin user...\n');

  // Create admin user
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@charity.org',
        password: 'admin123',
        role: 'admin'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@charity.org');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
      console.log('\n🚀 You can now login and start managing your charity dashboard!');
    } else {
      const error = await response.json();
      console.log('❌ Failed to create admin user:', error.message);
    }
  } catch (error) {
    console.log('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();
