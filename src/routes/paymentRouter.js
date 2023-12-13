const router = require("express").Router();

const paymentController = require("../Controllers/payment.controller");
const verifyToken = require("../middleware/CheckLogin");

router.post(
  "/create_payment_vnpay",
  verifyToken,
  paymentController.createPayment
);

router.post("/vnpay_callback", verifyToken, paymentController.callbackVnPay);

module.exports = router;
