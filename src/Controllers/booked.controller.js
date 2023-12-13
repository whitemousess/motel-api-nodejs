const bookedModel = require("../models/booked.model");
const motelModel = require("../models/motel.model");

module.exports = {
  getMyBooked(req, res, next) {
    bookedModel
      .find({ userId: req.user.id ,status: 0})
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

  booked(req, res, next) {
    req.body.motelId = req.params.id;
    req.body.userId = req.user.id;

    const booked = new bookedModel(req.body);
    booked
      .save()
      .then((data) => {
        motelModel
          .findOneAndUpdate(
            { _id: req.body.motelId },
            { status: 1 }
          )
          .then(res.status(200).json({ data }));
      })
      .catch((err) => res.sendStatus(500));
  },

  cancel(req, res, next) {
    bookedModel
      .findOneAndDelete({ _id: req.params.id })
      .then((data) =>
        motelModel
          .findOneAndUpdate({ _id: data.motelId }, {status: 0})
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
};
