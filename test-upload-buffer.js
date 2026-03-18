require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("Testing Cloudinary upload with buffer...");
console.log("Cloud Name:", process.env.CLOUD_NAME);

// Create a simple 1x1 red pixel PNG (smallest valid PNG)
const pngBuffer = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
  0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xde, 0x00, 0x00, 0x00,
  0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0x0f, 0x00, 0x00,
  0x01, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00,
  0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
]);

console.log("Uploading 1x1 pixel PNG...\n");

const uploadStream = cloudinary.uploader.upload_stream(
  { folder: 'avatars', resource_type: 'auto' },
  (error, result) => {
    if (error) {
      console.error("❌ Upload failed!");
      console.error("Error code:", error.http_code);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
    } else {
      console.log("✅ Upload successful!");
      console.log("URL:", result.secure_url);
      console.log("\nFull response:");
      console.log(JSON.stringify(result, null, 2));
    }
  }
);

streamifier.createReadStream(pngBuffer).pipe(uploadStream);
