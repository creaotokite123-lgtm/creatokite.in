require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const { User } = require('./src/models');

  const testEmails = ['creator1@demo.com', 'brand@demo.com', 'admin@creatokite.in'];

  for (const email of testEmails) {
    const user = await User.findOne({ email });
    console.log(`\nChecking: ${email}`);
    if (!user) {
      console.log('❌ User NOT found in database');
      continue;
    }
    
    console.log(`✅ User found! ID: ${user._id}, Role: ${user.role}, IsVerified: ${user.isVerified}`);
    
    const bcrypt = require('bcryptjs');
    const password = email === 'admin@creatokite.in' ? (process.env.ADMIN_PASSWORD || 'Admin@12345') : 'Demo@12345';
    const match = await bcrypt.compare(password, user.password || '');
    console.log(`${match ? '✅' : '❌'} ${email} | role: ${user.role} | emailVerified: ${user.emailVerified} | provider: ${user.provider || 'local'} | password match: ${match}`);
  }

  await mongoose.disconnect();
}).catch(e => { console.error('DB Error:', e.message); process.exit(1); });
