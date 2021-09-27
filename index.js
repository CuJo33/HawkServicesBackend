/// importing the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;

const Booking = require("./models/booking");
const Client = require("./models/client");
const Employee = require("./models/employee");
const Job = require("./models/job");
const JobStatus = require("./models/jobStatus");
const Quote = require("./models/quote");
const Room = require("./models/room");
const Service = require("./models/service");
const { v4: uuidv4 } = require("uuid");
const { removeAllListeners } = require("nodemon");

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

// A point to add all things to all tables
app.get("/instance", async (req, res) => {
  const newBooking = new Booking({
    bookingId: ObjectId(),
    clientId: ObjectId(),
    employeeId: ObjectId(),
    requestDate: String(Date.now()),
    bookedDate: String(Date.now()),
    completed: 0,
    lastUpdated: String(Date.now()),
  });
  const newClient = new Client({
    clientId: ObjectId(),
    username: "something",
    password: "password",
    token: ObjectId(),
    firstName: "Joe",
    surname: "Bloggs",
    addressLine1: "7 Queens Gardens",
    addressLine2: "Sheffield",
    postCode: "S2 3RZ",
    telephoneNumber: "07845690406",
    email: "josephcurtislap@gmail.com",
    lastUpdated: String(Date.now()),
  });
  const newEmployee = new Employee({
    employeeId: ObjectId(),
    username: "something",
    password: "password",
    token: ObjectId(),
    firstName: "Joe",
    surname: "Curtis",
    role: "Admin",
    lastUpdated: String(Date.now()),
  });
  const newJob = new Job({
    jobId: ObjectId(),
    clientId: ObjectId(),
    quoteId: ObjectId(),
    roomId: ObjectId(),
    serviceId: ObjectId(),
    jobStatusId: ObjectId(),
    employeeId: ObjectId(),
    startDate: String(Date.now()),
    estimatedCompletionDate: String(Date.now()),
    completedDate: String(Date.now()),
    clientSignOff: 0,
    clientSignOffDate: String(Date.now()),
    lastUpdated: String(Date.now()),
  });
  const newJobStatus = new JobStatus({
    jobStatusId: ObjectId(),
    jobStatusName: "NOTSTARTED",
    fullJobStatusName: "Not Started",
    lastUpdated: String(Date.now()),
  });
  const newQuote = new Quote({
    quoteId: ObjectId(),
    clientId: ObjectId(),
    employeeId: ObjectId(),
    jobList: [ObjectId(), ObjectId(), ObjectId()],
    clientAccepted: 0,
    RequestDate: String(Date.now()),
    lastUpdated: String(Date.now()),
  });
  const newRoom = new Room({
    roomId: ObjectId(),
    roomName: "KITCHEN",
    fullRoomName: "Kitchen",
    lastUpdated: String(Date.now()),
  });
  const newService = new Service({
    serviceId: ObjectId(),
    serviceName: "PAINT",
    fullServiceName: "Paint the Walls",
    specificRoomId: ObjectId(),
    specificResourceId: ObjectId(),
    lastUpdated: String(Date.now()),
  });
  // await newBooking.save();
  // await newEmployee.save();
  // await newClient.save();
  // await newJob.save();
  // await newJobStatus.save();
  // await newQuote.save();
  // await newRoom.save();
  // await newService.save();
  // await newUser.save();
  res.send(true);
});

// create a new client function
async function addClient(body, res) {
  const { email, password, username } = body;
  if (!username || !password || !email) {
    return res.send({
      status: 404,
      message: `Missing ${
        username
          ? password
            ? email
              ? "will never run :)"
              : "Email"
            : "Password"
          : "Username"
      }`,
    });
  }
  const newClient = new Client(body);
  const clientId = ObjectId();
  newClient.clientId = clientId;
  newClient.token = ObjectId();
  await newClient.save();
  return res.send({
    status: 200,
    message: "Created New Client " + newClient.username,
  });
}

// create a new employee function
async function addEmployee(body, res) {
  const { password, username } = body;
  if (!username || !password) {
    return res.send({
      status: 404,
      message: `Missing ${
        username ? (password ? "will never run :)" : "Password") : "Username"
      }`,
    });
  }
  const newEmployee = new Employee(body);
  const EmployeeId = ObjectId();
  newEmployee.employeeId = EmployeeId;
  newEmployee.token = ObjectId();
  await newEmployee.save();
  return res.send({
    status: 200,
    message: "Created New Employee " + newEmployee.username,
  });
}

// update the client table with the additional information
async function updateClient(body, res) {
  const {
    clientId,
    firstName,
    surname,
    addressLine1,
    addressLine2,
    postCode,
    telephoneNumber,
  } = body;
  if (
    !firstName ||
    !surname ||
    !addressLine1 ||
    !addressLine2 ||
    !postCode ||
    !telephoneNumber
  ) {
    return res.send({
      status: 404,
      message: `Missing ${
        firstName
          ? surname
            ? addressLine1
              ? addressLine2
                ? postCode
                  ? telephoneNumber
                    ? "will never run :)"
                    : "Telephone Number"
                  : "Post Code"
                : "Address Line 2"
              : "Address Line 1"
            : "Surname"
          : "First name"
      }`,
    });
  }
  await Client.findOneAndUpdate(
    { clientId: ObjectId(clientId) },
    {
      firstName: firstName,
      surname: surname,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      postCode: postCode,
      telephoneNumber: telephoneNumber,
    }
  );
}

// create a new booking
async function addBooking(body, res) {
  const requestDate = body.requestDate;
  if (!requestDate) {
    return res.send({
      status: 404,
      message: `Missing Request Date`,
    });
  }
  const newBooking = new Booking(body);
  const bookingId = ObjectId();
  newBooking.bookingId = bookingId;
  newBooking.requestDate = requestDate;
  await newBooking.save();
}

// create a new user with a parameter to create either an employee or a client
// if creating an client we add them to the clients table
// if creating an employee we add them to the employee table
// so seperate functions created above
// requested data {Email, username, password}
app.post("/signup/:userType", async (req, res) => {
  if (req.params.userType === "client") {
    const oldUser = await Client.findOne({ username: req.body.username });
    if (oldUser) {
      return res.send({ status: 404, message: `User already exists` });
    }
    addClient(req.body, res);
  } else if (req.params.userType === "employee") {
    const oldUser = await Employee.findOne({ username: req.body.username });
    if (oldUser) {
      return res.send({ status: 404, message: `User already exists` });
    }
    addEmployee(req.body, res);
  } else {
    return res.send({ status: 404, message: `That Page Doesn't exist` });
  }
});

// creating log in's
// 2 seperate login pages due to needing to know if client or employee

// Client Login
// requires username and password
// returns the auth token
// updates the client table with that token.
app.post("/login/", async (req, res) => {
  const client = await Client.findOne({ username: req.body.username });
  if (!client) {
    return res.send({ status: 401, message: "Missing Username" });
  }
  if (req.body.password !== client.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  client.token = ObjectId();
  await client.save();
  res.send({ token: client.token });
});

// Employee Login
// requires username and password
// returns the auth token
// updates the Employee table with that token.
app.post("/login/employee", async (req, res) => {
  const employee = await Employee.findOne({ username: req.body.username });
  if (!employee) {
    return res.send({ status: 401, message: "Missing Username" });
  }
  if (req.body.password !== employee.password) {
    return res.send({ status: 403, message: `Incorrect Password` });
  }
  employee.token = ObjectId();
  await employee.save();
  res.send({ token: employee.token });
});

// Only if we have an auth do next()
app.use(async (req, res, next) => {
  const authHeader = req.headers["auth"];
  // Check if Client and allow through if authed
  const client = await Client.findOne({ token: authHeader });
  if (client) {
    next();
  } else {
    // Check if employee and allow through if authed
    const employee = await Employee.findOne({ token: authHeader });
    if (employee) {
      next();
    } else {
      res.sendStatus(403);
    }
  }
});

// defining CRUD operations
// Make a booking by the client
app.post("/booking", async (req, res) => {
  updateClient(req.body, res);
  addBooking(req.body, res);
  res.send({ message: "Client Updated and New Booking Added" });
});

// Populate booking site if we have the info
app.get("/booking/:clientId", async (req, res) => {
  res.send(await Client.findOne({ clientId: ObjectId(req.params.clientId) }));
});

// Create a new Job
app.post("/Job", async (req, res) => {
  const { clientId, roomId, serviceId, jobStatusId } = req.body;
  if (!roomId || !serviceId) {
    return res.send({
      status: 404,
      message: `Missing ${
        roomId ? (serviceId ? "will never run :)" : "Service") : "Room"
      }`,
    });
  }
  const newJob = new Job(req.body);
  const jobId = ObjectId();
  newJob.jobId = jobId;
  newJob.clientId = clientId;
  newJob.jobStatusId = jobStatusId;
  await newJob.save();
  res.send({
    status: 200,
    message: `New Job Added`,
  });
});

// Get the jobStatuses table
// this will feed the drop down menu for the jobs page & the employee update page
app.get("/jobStatus", async (req, res) => {
  res.send(await JobStatus.find());
});

// Get the Rooms table
// this will feed the drop down menu for the jobs page
app.get("/room", async (req, res) => {
  res.send(await Room.find());
});

// Get the Services table
// this will feed the drop down menu for the jobs page
app.get("/services", async (req, res) => {
  res.send(await Services.find());
});

// Update the Job quoteId once the quote is compelted.
// recurse over the job list in a quote in order to add the quoteId to all the jobs.
app.put("/Job", async (req, res) => {
  const quoteId = req.body.quoteId;
  await Job.findOneAndUpdate(
    { jobId: ObjectId(jobId) },
    {
      quoteId: quoteId,
    }
  );
  return res.send({ status: 200, message: `Updated Jobs in quote` });
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
