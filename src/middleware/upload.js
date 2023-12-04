const multer = require("multer");
const cloudinary = require("../config/db/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "motel",
    allowedFormats: ["jpg", "png", "jpeg"],
    transformations: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  dest: "/motels",
});

module.exports = upload;
