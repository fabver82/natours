const fs = require("fs");
const Post = require("./../models/tourModels");
const APIFeatures = require("./../utils/apiFeatures");

exports.getTour = async (req, res) => {
  // const id = req.params.id * 1; //convert to number

  // const tour = tours.find((el) => el.id === id);

  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({
      status: "success",
      // results: tours.length,
      data: {
        post,
      },
    });
  } catch (err) {}
};

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage";
  req.query.fields = "title,description,ratingsAverage";
  next();
};

exports.getAllTour = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const posts = await features.query;

    //send response

    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "error",
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Post.create(req.body);
    console.log(newTour);
    res.status(201).json({
      status: "success",
      data: {
        post: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        post: "<Updated post here...",
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    // await Post.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: {
        post: null,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Post.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: "$location",
          num: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
        },
      },
      {
        $sort: { numRatings: 1 },
      },
      {
        $match: {
          _id: { $ne: "Belgium" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Post.aggregate([
      {
        $unwind: "$createAt",
      },
      {
        $match: {
          createAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createAt" },
          numTourCreated: { $sum: 1 },
          tours: { $push: "$title" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourCreated: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};
