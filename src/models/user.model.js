const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: { type: String, require: true, unique: true },
    fullName: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    imageURl: { type: String ,default: null},
    favoriteId: [
      {
        _id: false,
        motelId: {
          type: Schema.Types.ObjectId,
          ref: "favorites",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", schema);
