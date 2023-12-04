const cloudinary = require('cloudinary').v2;
  
cloudinary.config({ 
  cloud_name: 'dd6sxqlso', 
  api_key: '875768816149933', 
  api_secret: 'IAsVYhcEazX1acxtvPAxDAa9nHY' 
})

module.exports = cloudinary;