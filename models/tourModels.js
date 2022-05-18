const mongoose = require("mongoose");
const slugify = require("slugify");
const postSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//example of virtuals
// postSchema.virtual('durationWeeks').get(function(){
//   return this.duration /7;
// })

//document middleware: runs before .save() and .create()
postSchema.pre("save", function () {});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
