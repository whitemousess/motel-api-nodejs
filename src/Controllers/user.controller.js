const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const cloudinary = require("../config/db/cloudinary");

const UserModel = require("../models/user.model");

module.exports = {
  register(req, res, next) {
    UserModel.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          res.status(409).json({ error: "username is validate" });
        } else {
          const handlePassword = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.ACCESS_TOKEN
          ).toString();

          req.body.password = handlePassword;
          const account = new UserModel(req.body);
          account
            .save()
            .then((data) => {
              res.status(200).json({ data });
            })
            .catch((error) => res.sendStatus(500));
        }
      })
      .catch((error) => res.sendStatus(500));
  },

  editUser(req, res, next) {
    if (req.file) {
      req.body.imageUrl = req.file.path;
    } else {
      req.body.imageUrl = req.user.imageUrl;
    }

    if (req.body.password !== "undefined") {
      const handlePassword = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.ACCESS_TOKEN
      ).toString();
      req.body.password = handlePassword;
    }else {
      req.body.password = req.user.password;
    }

    if (req.body.fullName == "" || req.body.email == "") {
      res.status(204).json({ message: "Value is Not available" });
    } else {
      UserModel.findOneAndUpdate({ _id: req.user.id }, req.body)
        .then((user) => {
          if (req.file && user.imageUrl) {
            const image_id =
              "motel" + user.imageUrl.split("/motel")[1].split(".")[0];
            cloudinary.uploader.destroy(image_id);
          }

          res.status(200).json({ data: user });
        })
        .catch(() => res.sendStatus(500));
    }
  },

  login(req, res, next) {
    UserModel.findOne({ username: req.body.username })
      .then((data) => {
        if (!data) res.status(404).json({ error: "Invalid username" });
        else {
          const hashedPassword = CryptoJS.AES.decrypt(
            data.password,
            process.env.ACCESS_TOKEN
          ).toString(CryptoJS.enc.Utf8);

          if (hashedPassword !== req.body.password) {
            return res.status(401).json({ error: "Invalid password" });
          }

          const accessToken = jwt.sign(
            {
              id: data._id,
            },
            process.env.ACCESS_TOKEN,
            {
              expiresIn: "7d",
            }
          );

          const { ...other } = data._doc;

          res.status(200).json({ ...other, token: accessToken });
        }
      })
      .catch((err) => res.sendStatus(500));
  },

  getUser(req, res, next) {
    UserModel.findById(req.params.id)
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((err) => res.sendStatus(500));
  },

  currentUser(req, res, next) {
    UserModel.findById(req.user.id)
      .then((data) => {
        res.status(200).json({
          data: {
            _id: data._id,
            username: data.username,
            fullName: data.fullName,
            email: data.email,
            imageUrl: data.imageUrl,
            address: data.address,
          },
        });
      })
      .catch((err) => res.sendStatus(500));
  },
};
