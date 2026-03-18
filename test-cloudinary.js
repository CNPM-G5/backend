require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log('Testing Cloudinary credentials...');
console.log('CLOUD_NAME:', process.env.CLOUD_NAME);
console.log('CLOUD_API_KEY:', process.env.CLOUD_API_KEY);
console.log('CLOUD_API_SECRET:', process.env.CLOUD_API_SECRET.substring(0, 5) + '...');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Test API call
cloudinary.api.root_folders()
  .then(result => {
    console.log('✅ Credentials valid! Root folders:', result);
  })
  .catch(error => {
    console.error('❌ Credentials invalid:', error.message);
    console.error('Error details:', error);
  });
