require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createFirstSuperAdmin = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    const email = 'aland.surchi456@gmail.com';
    const password = 'Aa11don.,';
    const name = 'Aland Surchi';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`✅ User already exists: ${email}`);
      console.log('Updating to super_admin role...');
      existingUser.password = password;
      existingUser.role = 'super_admin';
      existingUser.name = name;
      await existingUser.save();
      console.log('✅ Updated successfully');
    } else {
      // Create new super admin
      const newAdmin = new User({
        name: name,
        email: email,
        password: password,
        role: 'super_admin'
      });

      await newAdmin.save();
      console.log('✅ First super admin created successfully');
    }
    
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: super_admin`);

    // List all users
    console.log('\n📋 All super admins:');
    const superAdmins = await User.find({ role: 'super_admin' }).select('-password');
    superAdmins.forEach(user => {
      console.log(`   - ${user.email} - ${user.name}`);
    });

    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createFirstSuperAdmin();
