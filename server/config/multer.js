const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary'); // Import Cloudinary configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_images', // Folder name in Cloudinary
    allowed_formats: ['jpeg', 'png', 'jpg'], // Supported file formats
  },
});

const upload = multer({ storage });

module.exports = upload;
