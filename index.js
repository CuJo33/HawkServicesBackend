/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;

const { Event } = require("./models/event");
const { User } = require("./models/user");
const { v4: uuidv4 } = require("uuid");

mongoose.connect(
  "mongodb+srv://user:B4gwNf8wEtXUSWOS@cluster0.m3j75.mongodb.net/hawkservices?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.post("/user", async (req, res) => {
  const newUser = new User(req.body);
  const password = req.body.password;
  const user = req.body.username;
  const oldUser = await User.findOne({ username: req.body.username });
  if (!oldUser) {
    if (!user) {
      return res.send({ status: 404, message: `Missing User` });
    } else if (!password) {
      return res.send({ status: 404, message: `Missing Password` });
    }
    user.token = uuidv4();
    await newUser.save();
    return res.send({
      status: 200,
      message: "Created User " + newUser.username,
    });
  } else {
    return res.send({ status: 404, message: `User already exists` });
  }
});

// creating auth
app.post("/auth", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.send({ status: 401, message: "Missing User" });
  }
  if (req.body.password !== user.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  user.token = uuidv4();
  await user.save();
  res.send({ token: user.token });
});

app.use(async (req, res, next) => {
  const authHeader = req.headers["auth"];
  const user = await User.findOne({ token: authHeader });
  if (user) {
    next();
  } else {
    res.sendStatus(403);
  }
});

// defining CRUD operations
// get all
app.get("/", async (req, res) => {
  res.send(await Event.find());
});

// post new
app.post("/", async (req, res) => {
  const newEvent = req.body;
  const event = new Event(newEvent);
  event.date = new Date(req.body.date).toISOString().slice(0, 10);
  await event.save();
  res.send({ message: "New Event Added" });
});

// delete
app.delete("/:id", async (req, res) => {
  await Event.deleteOne({ _id: ObjectId(req.params.id) });
  res.send({ message: "Event Deleted" });
});

// find and update
app.put("/:id", async (req, res) => {
  await Event.findOneAndUpdate({ _id: ObjectId(req.params.id) }, req.body);
  res.send({ message: "Event updated" });
});

// starting the server
app.listen(port, () => {
  console.log(`listening on  ${port}`);
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function callback() {
  console.log("Database connected!");
});
