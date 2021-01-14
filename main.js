require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.use(express.static('./public/'));

const WEB_PORT=process.env.WEB_PORT;

console.log(WEB_PORT);

/*const ufoController = require("./controllers/ufos");

mongoose.connect('mongodb://localhost:27017/ufo-scrubbed', { useNewUrlParser: true });*/
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
  );
  process.exit();
});

const ufoController = require("./controllers/ufos");

const userUfoController = require("./controllers/userufos");

//simple app.get to serve pages with no use to controller
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/ufo-finder-form", (req, res) => {
  res.render("ufo-finder-form");
});

app.get("/ufo-create", (req, res) => {
  res.render("ufo-create");
});

//gets user data from finder form and sends it to ufo controller for processing
app.get("/ufo-finder-form-data/:lat/:long/:year",ufoController.find);

app.get("/user-ufos",userUfoController.findall);

app.get("/user-ufos-delete/:id",userUfoController.delete);

app.get("/user-ufos-create/:datetime/:city/:state/:country/:shape/:durationhoursmin/:comments/:latitude/:longitude",userUfoController.create);

app.get("/user-ufos-update/:id",userUfoController.findOne)

app.get("/user-ufos-update-confirm/:datetime/:city/:state/:country/:shape/:durationhoursmin/:comments/:latitude/:longitude/:id",userUfoController.update)

//listens on port for traffic
app.listen(WEB_PORT, () => {
  console.log(`Example app listening at http://localhost:8080`);
});