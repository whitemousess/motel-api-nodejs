const cloudinary = require("../config/db/cloudinary");

const motelModel = require("../models/motel.model");
const bookModel = require("../models/booked.model");
const favoriteModel = require("../models/favorite.model");

module.exports = {
  getSearch(req, res, next) {
    const { province, district, type } = req.query;
    const objWhere = {};

    if (province && district) {
      objWhere.province = new RegExp(province, "i");
      objWhere.district = new RegExp(district, "i");
    }
    if (type) objWhere.type = new RegExp(type, "i");
    objWhere.status = 0;

    motelModel
      .find(objWhere)
      .then((data) => res.json(data))
      .catch((err) => res.sendStatus(500));
  },

  getAll(req, res, next) {
    const { page, per_page } = req.query;

    motelModel
      .find({ status: 0 })
      .populate("userId")
      .then((data) => {
        const currentPage = page || 1;
        const itemsPerPage = per_page || data.length;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const items = data.slice(startIndex, endIndex);

        res.json({
          data: items,
          currentPage,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        });
      })
      .catch((err) => res.sendStatus(500));
  },

  getMyMotel(req, res, next) {
    motelModel
      .find({ userId: req.user.id })
      .then((data) => res.json({ data }))
      .catch((err) => res.sendStatus(500));
  },

  getMotelById(req, res, next) {
    motelModel
      .findById(req.params.id)
      .populate("userId")
      .then((data) => res.json({ data }))
      .catch((err) => res.sendStatus(500));
  },

  motelUser(req, res, next) {
    motelModel
      .find({ userId: req.params.id })
      .populate("userId")
      .then((data) => res.json({ data }))
      .catch((err) => res.sendStatus(500));
  },

  createMotel(req, res, next) {
    const imageArray = [];
    if (req.files) {
      req.files.forEach((file) => {
        imageArray.push(file.path);
      });
    }
    req.body.imageUrl = imageArray;
    req.body.userId = req.user.id;
    if (isNaN(req.body.price)) {
      req.body.price = 0;
    }

    for (let key in req.body) {
      if (req.body[key] === "" || req.files == 0) {
        return res.status(400).json({
          message: "Invalid request data. Empty values are not allowed.",
        });
      }
    }

    const motel = new motelModel(req.body);
    motel
      .save()
      .then((data) => res.json({ data }))
      .catch((err) => res.sendStatus(500));
  },

  editMotel(req, res, next) {
    motelModel
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((data) => res.json({ data }))
      .catch((err) => res.sendStatus(500));
  },

  deleteMotel(req, res, next) {
    const deleteMotel = motelModel
      .findOneAndDelete({ _id: req.params.id })
      .then((data) => {
        data.imageUrl.forEach((image) => {
          const image_id = "motel" + image.split("/motel")[1].split(".")[0];
          cloudinary.uploader.destroy(image_id);
        });
        res.status(200).json("OK");
      })
      .catch((err) => res.sendStatus(500));

    const deleteFavorite = favoriteModel
      .deleteMany({ motelId: req.params.id })
      .then((data) => console.log(data))
      .catch((err) => res.sendStatus(500));

    bookModel
      .find({ motelId: req.params.id, status: 0 })
      .then((data) => {
        if (data.length > 0) {
          res.status(400).json({ message: "There's someone here" });
        } else {
          deleteMotel;
          deleteFavorite;
        }
      })
      .catch((err) => res.status(500).json(err));
  },
};
