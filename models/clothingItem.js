// const mongoose = require("mongoose");
// const validator = require("validator");

// const clothingItem = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   weather: {
//     type: String,
//     required: true,
//   },
//   imageURL: {
//     type: String,
//     required: true,
//     validate: {
//       validator: (v) => validator.isURL(v),
//       message: "Please provide a valid URL",
//     },
//   },
// });

// module.exports = mongoose.model("clothingItems", clothingItem);

// updated code with added fields

const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Please provide a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Replace 'User' with the actual name of your user model
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Replace 'User' with the actual name of your user model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItems", clothingItemSchema);
