const favoriteModel = require("../models/favorite.model");

module.exports = {
  likedMotel(req, res, next) {
    req.body.userId = req.user.id;
    const favorite = new favoriteModel(req.body);
    favorite
      .save()
      .then((data) => res.status(200).json(data))
      .catch((err) => res.sendStatus(500));
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
