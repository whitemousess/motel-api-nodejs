const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/CheckLogin");
const favoriteControllers = require("../Controllers/favorite.controller");

// get all items
router.get('/motel-my-liked',verifyToken, favoriteControllers.getMotelLiked)

router.post('/liked',verifyToken, favoriteControllers.likedMotel)
router.delete('/unLiked/:id',verifyToken, favoriteControllers.unLiked)

module.exports = router;
