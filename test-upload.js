require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Credentials loaded:");
console.log("Cloud Name:", process.env.CLOUD_NAME);
console.log("API Key:", process.env.CLOUD_API_KEY);

// Create a test image
const testImagePath = path.join(__dirname, 'test.jpg');
if (!fs.existsSync(testImagePath)) {
  console.log("Note: test.jpg not found. Using any JPG file instead.");
  console.log("\nTo test upload, run:");
  console.log("cloudinary.uploader.upload('path/to/image.jpg', { folder: 'avatars' })");
  process.exit(0);
}

// Try to upload
cloudinary.uploader.upload(testImagePath, { folder: 'avatars' })
  .then(result => {
    console.log("✅ Upload successful!");
    console.log("File uploaded to:", result.secure_url);
  })
  .catch(error => {
    console.error("❌ Upload failed:");
    console.error("Status:", error.http_code);
    console.error("Error:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));
  });
