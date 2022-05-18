const fs = require("fs");
const Post = require("./../models/tourModels");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   if (req.param.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || req.body.price) {
//     return res.status(400).json({
//       status: "fail",
//       message: "Missing name or price",
//     });
//   }
//   next();
// };
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
exports.getAllTour = async (req, res) => {
  // console.log(req.requestTime);
  try {
    //BUILD QUERY STR
    //1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);
    //2) ADVANCE FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/, (match) => `$${match}`);
    console.log(JSON.parse(queryStr));

    let query = Post.find(JSON.parse(queryStr));

    // sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createAt");
    }

    //field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numPosts = await Post.countDocuments();
      if (skip > numPosts) throw new Error("This page does not exist");
    }
    // EXECUTE QUERY
    const posts = await query;

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
  //   console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
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

  // }
  // );

  //   res.send("Done");
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
