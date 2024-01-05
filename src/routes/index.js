const userRouter = require("./userRouter");
const motelRouter = require("./motelRouter");
const favoriteRouter = require("./favoriteRouter");
const bookedRouter = require("./bookedRouter");
const paymentRouter = require("./paymentRouter");
const forgotPasswordRouter = require("./forgotPasswordRouter");

function route(app) {
  app.use("/api/user", userRouter);
  app.use("/api/motel", motelRouter);
  app.use("/api/favorite", favoriteRouter);
  app.use("/api/booked", bookedRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/forgot", forgotPasswordRouter);

  app.use("/", function (req, res, next) {
    res.send("NOT FOUND");
  });
}

module.exports = route;
