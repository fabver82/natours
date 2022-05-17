const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//1)middle wares
app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(express.json()); //middleware for express

//2) ROUTE HANDLER

// app.get("/api/v1/tours/:id?", getTour);
// app.post("api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.get("/api/v1/tours", getAllTour);

//3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
//4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
