const favoriteModel = require("../models/favorite.model");
const motelModel = require("../models/motel.model");

module.exports = {
  async likedMotel(req, res, next) {
    req.body.userId = req.user.id;
    const motel = await motelModel.findById(req.body.motelId);
    if (motel) {
      favoriteModel.findOne({ motelId: req.body.motelId }).then((data) => {
        if (data) {
          res.status(409).json({ error: "Liked this room" });
        } else {
          const favorite = new favoriteModel(req.body);
          favorite
            .save()
            .then((data) => res.status(200).json(data))
            .catch((err) => res.sendStatus(500));
        }
      });
    } else {
      res.status(404).json({ error: "Motel not found" });
    }
  },

  getMotelLiked(req, res, next) {
    favoriteModel
      .find({ userId: req.user.id })
      .populate("motelId")
      .then((data) => {
        const listFavorites = [];
        const fillFavorite = data.filter((motel) => motel.motelId != null);
        fillFavorite.forEach((motel) => {
          listFavorites.push(motel.motelId);
        });
        res.json({ data: listFavorites });
      })
      .catch((err) => res.sendStatus(500));
  },

  unLiked(req, res, next) {
    favoriteModel
      .findOneAndDelete({ motelId: req.params.id, userId: req.user.id })
      .then((data) => res.status(200).json(data))
      .catch((err) => res.sendStatus(500));
  },
};
