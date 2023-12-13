const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    motelId: { type: Schema.Types.ObjectId, ref: "motels", required: true },
    status :{type: Number, default: 0}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("booked", schema);
