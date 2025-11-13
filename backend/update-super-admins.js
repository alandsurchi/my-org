require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const updateSuperAdmins = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');

    // Update first super admin
    const firstEmail = 'aland.surchi456@gmail.com';
    const firstUser = await User.findOne({ email: firstEmail });
    
    if (firstUser) {
      console.log(`\n📝 Updating first super admin: ${firstEmail}`);
      firstUser.role = 'super_admin';
      firstUser.name = firstUser.name || 'Aland Surchi';
      await firstUser.save();
      console.log('✅ First super admin updated successfully');
      console.log(`   Name: ${firstUser.name}`);
      console.log(`   Email: ${firstUser.email}`);
      console.log(`   Role: ${firstUser.role}`);
    } else {
      console.log(`❌ User not found: ${firstEmail}`);
    }

    // Update second super admin
    const secondEmail = 'aland.raed.othman@gmail.com';
    const secondPassword = 'Aasecond.,';
    
    const secondUser = await User.findOne({ email: secondEmail });
    if (secondUser) {
      console.log(`\n📝 Updating second super admin: ${secondEmail}`);
      secondUser.password = secondPassword;
      secondUser.role = 'super_admin';
      secondUser.name = secondUser.name || 'Aland Raed Othman';
      await secondUser.save();
      console.log('✅ Second super admin updated successfully');
      console.log(`   Name: ${secondUser.name}`);
      console.log(`   Email: ${secondUser.email}`);
      console.log(`   Role: ${secondUser.role}`);
      console.log(`   Password: ${secondPassword}`);
    } else {
      console.log(`❌ User not found: ${secondEmail}`);
    }

    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find().select('-password');
    allUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - ${user.name || 'No name'}`);
    });

    await mongoose.connection.close();
    console.log('\n🔒 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateSuperAdmins();
