const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "a post must have a title"],
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: String,
    required: [true, "a post must have a description"],
  },
  rating: {
    type: Number,
    default: 0,
  },
});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
