require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createSecondAdmin = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    const email = 'aland.raed.othman@gmail.com';
    const password = 'Aasecond.,';
    const name = 'Aland Raed Othman';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️  User with email ${email} already exists`);
      console.log('Updating password...');
      existingUser.password = password;
      existingUser.role = 'super_admin';
      existingUser.name = name;
      await existingUser.save();
      console.log('✅ Password and role updated successfully');
    } else {
      // Create new super admin
      const newAdmin = new User({
        name: name,
        email: email,
        password: password,
        role: 'super_admin'
      });

      await newAdmin.save();
      console.log('✅ Second super admin created successfully');
      console.log(`   Email: ${email}`);
      console.log(`   Name: ${name}`);
      console.log(`   Role: super_admin`);
    }

    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createSecondAdmin();
