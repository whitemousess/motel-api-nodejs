const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, require: true, ref: "users" },
    title: { type: String, require: true },
    imageUrl: { type: Array, require: true},
    description: { type: String, require: true },
    province: { type: String, require: true },
    district: { type: String, require: true },
    type: { type: String, require: true },
    price: { type: Number, require: true },
    status: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("motels", schema);
