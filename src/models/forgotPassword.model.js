const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    codeReset: { type: Number, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("forgot-passwords", schema);
