const bookedModel = require("../models/booked.model");
const motelModel = require("../models/motel.model");

module.exports = {
  getAllBooked(req, res, next) {
    bookedModel
      .find({})
      .then((data) => {
        res.json({ data: data });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  },

  getMyBooked(req, res, next) {
    bookedModel
      .find({ userId: req.user.id, status: 0 })
      .populate(["motelId", "userId"])
      .then((data) => {
        const fillMotel = data.filter((motel) => motel.motelId != null);

        res.json({ data: fillMotel });
      })
      .catch((err) => {
        console.error(err);
        res.sendStatus(500);
      });
  },

  async booked(req, res, next) {
    req.body.motelId = req.params.id;
    req.body.userId = req.user.id;

    const motel = await motelModel.findById(req.body.motelId);
    if (motel) {
      bookedModel
        .findOne({ motelId: req.body.motelId, status: 0 })
        .then((motel) => {
          if (motel) {
            res.status(409).json({ error: "Booked this room" });
          } else {
            const booked = new bookedModel(req.body);
            booked
              .save()
              .then((data) => {
                motelModel
                  .findOneAndUpdate({ _id: req.body.motelId }, { status: 1 })
                  .then(res.status(200).json({ data }));
              })
              .catch((err) => res.sendStatus(500));
          }
        });
    } else {
      res.status(404).json({ error: "Motel not found" });
    }
  },

  cancel(req, res, next) {
    bookedModel
      .findOneAndDelete({ _id: req.params.id })
      .then((data) =>
        motelModel
          .findOneAndUpdate({ _id: data.motelId }, { status: 0 })
          .then(res.status(200).json({ data }))
      )
      .catch((err) => res.sendStatus(500));
  },

  successPayment(req, res, next) {
    bookedModel
      .findOneAndUpdate({ _id: req.params.id }, { status: 1 })
      .then((data) => {
        motelModel
          .findOneAndUpdate({ _id: data.motelId }, { status: 0 })
          .then(res.status(200).json({ data }));
      })
      .catch((err) => res.sendStatus(500));
  },

  getMyUserBooked(req, res, next) {
    bookedModel
      .findOne({ motelId: req.params.id })
      .populate(["userId", "motelId"])
      .then((data) => {
        res.json({ data: data });
      })
      .catch((err) => {
        res.sendStatus(500);
      });
  },
};
