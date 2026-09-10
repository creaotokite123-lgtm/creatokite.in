require('dotenv').config();
const { sendVerificationMail } = require('./src/utils/sendEmail');

console.log('--- Testing Resend API Configuration ---');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.slice(0, 10)}...` : 'NOT SET');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || 'CreatoKite <onboarding@resend.dev>');

if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is empty. Please set it in backend/.env');
  process.exit(1);
}

const recipient = process.argv[2] || 'test@example.com';
console.log(`\nAttempting to send test email to: ${recipient}...`);

sendVerificationMail(recipient, 'Test User', 'demo-token-123')
  .then((success) => {
    if (success) {
      console.log('\n✅ Resend test finished successfully!');
    } else {
      console.error('\n❌ Resend test failed. Check the error log above.');
    }
  })
  .catch((err) => {
    console.error('\n❌ Resend test exception:', err);
  });
