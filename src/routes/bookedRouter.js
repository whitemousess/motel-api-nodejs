const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/CheckLogin");
const bookedController = require("../Controllers/booked.controller")

router.get('/get-all',verifyToken,bookedController.getAllBooked)
router.get('/my-booked',verifyToken,bookedController.getMyBooked)
router.get('/get-user-booked/:id',verifyToken,bookedController.getMyUserBooked)

router.get('/:id',verifyToken,bookedController.booked)
router.delete('/:id/cancel',verifyToken,bookedController.cancel)
router.get('/success-payment/:id',verifyToken,bookedController.successPayment)

module.exports = router;
