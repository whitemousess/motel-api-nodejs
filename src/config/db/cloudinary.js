const cloudinary = require('cloudinary').v2;
  
cloudinary.config({ 
  cloud_name: 'dd6sxqlso', 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
})

module.exports = cloudinary;