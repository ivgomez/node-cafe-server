require("./app/config");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes
app.use(require("./app/routes/index"));

mongoose.connect(
  process.env.URLDB,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw err;
    console.log("base de datos online");
  }
);

app.listen(process.env.PORT, () => {
  console.log("Listing port : ", 3000);
});