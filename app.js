const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json()); //middleware for express

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getTour = (req, res) => {
  const id = req.params.id * 1; //convert to number

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    // results: tours.length,
    data: {
      tour,
    },
  });
};
const getAllTour = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};
const createTour = (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );

  //   res.send("Done");
};
const updateTour = (req, res) => {
  if (req.param.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...",
    },
  });
};
// app.get("/api/v1/tours/:id?", getTour);
// app.post("api/v1/tours", createTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.get("/api/v1/tours", getAllTour);

//middleware order matter first route wont take it.
app.use((req, res, next) => {
  console.log("hello from middleware");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.route("/api/v1/tours").get(getAllTour).post(createTour);
app.route("/api/v1/tours/:id").get(getTour).patch(updateTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
