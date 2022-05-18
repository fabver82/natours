const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, "a post must have a title"],
  },
  location: {
    type: String,
    required: [true, "a post must have a location"],
  },
  imageCover: {
    type: String,
    required: [true, "a post must have a cover image"],
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: [true, "a post must have a description"],
  },
  ratingsAverage: {
    type: Number,
    defaut: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
