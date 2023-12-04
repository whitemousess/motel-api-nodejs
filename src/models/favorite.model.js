const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    motelId: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favorites", schema);
