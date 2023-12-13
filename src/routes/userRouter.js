const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const verifyToken = require("../middleware/CheckLogin");
const userControllers = require("../Controllers/user.controller");

// get all items
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);

router.get("/current-user", verifyToken, userControllers.currentUser);
router.get("/get-user/:id", verifyToken, userControllers.getUser);
router.put(
  "/edit",
  verifyToken,
  upload.single("imageUrl"),
  userControllers.editUser
);

module.exports = router;
