const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const authRouter = require("./routes/authRoute");
const monitorRouter = require("./routes/monitorRoute");
const { connectDbAndRunServer, connectViaInterface } = require("./configs/db");
require("dotenv").config();
// const { sendEmail } = require('./utils/sendEmail')

// **************************
// Here is where we can swap out DBs easily.  Spin up a mongoDB instance and try it out.
// Simply comment out the FakeDB and uncomment the MongoDB or vice versa.
// We can easily swap between any type of data source as long as the methods are implemented
//
// FakeDB
// const db = require("./db/FakeDb");
//
// MongoDB
const db = require("./db/MongoDB");
//
// **************************

/**
 * NOTES
 * Email Service will be added
 * Logger Service will be added (Winston or similar)
 */

const app = express();

// middlewares
app.use(
  cors()
  //We will add configuration later
);
app.use(express.json());
app.use(helmet());

// **************************
// Make DB accessible anywhere we have a Request object
// By adding the DB to the request object, we can access it in any route
// Thus we do not need to import it in every route file, and we can easily swap out DBs as there is only one place to change it
// **************************
app.use((req, res, next) => {
  req.db = db;
  next();
});

//routes
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/monitors", monitorRouter);

// Testing email service
// app.use('/sendEmail', async (req, res) => {
//     const response = sendEmail('veysel.boybay@outlook.com', ['veysel.boybay@bluewavelabs.ca'], 'Testing email service', '<h1>Testing Bluewavelabs</h1>');
//     console.log(response);
// })

//health check
app.use("/api/v1/healthy", (req, res) => {
  try {
    return res.status(200).json({ message: "Healthy" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

connectDbAndRunServer(app, db);
