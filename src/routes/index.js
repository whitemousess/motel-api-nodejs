const userRouter = require("./userRouter");

function route(app) {
  app.use("/api/user", userRouter);

  app.use("/", function (req, res, next) {
    res.send("NOT FOUND");
  });
}

module.exports = route;
