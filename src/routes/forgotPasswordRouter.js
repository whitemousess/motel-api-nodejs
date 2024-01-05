const router = require("express").Router();

const forgotPasswordController = require("../Controllers/forgotPass.controller");

router.post("/send-code", forgotPasswordController.sendCode);
router.put("/reset-password", forgotPasswordController.resetPassword);

module.exports = router;
