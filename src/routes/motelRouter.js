const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/CheckLogin");
const motelControllers = require("../Controllers/motel.controller");

// get all items
router.get("/get-all", motelControllers.getAll);
router.get("/my-motel",verifyToken, motelControllers.getMyMotel);
router.get("/get-motel/:id", motelControllers.getMotelById);
router.get("/search-motel", motelControllers.getSearch);
router.get("/motel-user/:id", motelControllers.motelUser);

router.post(
  "/create-motel",
  verifyToken,
  upload.any(),
  motelControllers.createMotel
);
router.put(
  "/edit-motel/:id",
  verifyToken,
  upload.any(),
  motelControllers.editMotel
);
router.delete(
  "/delete-motel/:id",
  verifyToken,
  upload.any(),
  motelControllers.deleteMotel
);

module.exports = router;
