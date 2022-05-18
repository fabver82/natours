const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Post = require("./../../models/tourModels");
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASS);
mongoose
  //   .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log("DB connections successful");
  });

//READ JSON FILE
const posts = JSON.parse(fs.readFileSync(`${__dirname}/posts.json`, "utf-8"));

//IMPORTE DATA INTO DB_PASS
const importData = async () => {
  try {
    await Post.create(posts);
    console.log("data successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//DELETE All DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Post.deleteMany();
    console.log("data successfully deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
