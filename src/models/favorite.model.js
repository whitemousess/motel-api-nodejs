const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    motelId: { type: Schema.Types.ObjectId, ref: "motels", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favorites", schema);
