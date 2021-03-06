const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const userRoutes = require("./app/routes/user");
const postsRoute = require("./app/routes/posts");
const commentsRoute = require("./app/routes/comments");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());

app.use(morgan("tiny"));
app.use("/api/v1", userRoutes);
app.use("/api/v1", postsRoute);
app.use("/api/v1", commentsRoute);

app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to teamwork api v1",
  });
});

app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err,
    });
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Dont forget your make runnable ");
});
