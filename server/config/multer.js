const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Import Cloudinary configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_uploads',
    resource_type: 'auto', // auto-detect file type (video, image, raw, etc.)
    allowed_formats: ['pdf', 'jpeg', 'png', 'jpg'], // Include PDF
  },
});

const upload = multer({ storage });
module.exports = upload;

