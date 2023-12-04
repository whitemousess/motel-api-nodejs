const mongoose = require("mongoose");

// connect database in Mongo
async function connect() {
  try {
    await mongoose.connect(
      "mongodb+srv://chuotbach:Tnt%402002@chuotbach.36qa5fh.mongodb.net/motel"
    );
    console.log("Connect successfully");
  } catch (error) {
    console.log("Connect failure");
  }
}

module.exports = { connect };
