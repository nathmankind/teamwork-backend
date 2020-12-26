const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Teamwork app api" });
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
  console.log(`Server running on port ${8000}`);
});
