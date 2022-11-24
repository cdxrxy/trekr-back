const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const schedule = require("node-schedule");

// Routes
const bookingsRoute = require("./routes/bookings");
const employeesRoute = require("./routes/employees");
const vehiclesRoute = require("./routes/vehicles");
const settingsRoute = require("./routes/settings");
const usersRoute = require("./routes/users");
const bookingFormsRoute = require("./routes/bookingForms");
const authRoute = require("./routes/auth");
const calendarsRoute = require("./routes/calendars");
const verificationRoute = require("./routes/verification");
const notificationsRoute = require("./routes/notifications");
const estimateRoute = require("./routes/estimate");
const dailyNotifications = require("./services/notificationsService");

dotenv.config();

var upload = multer();

/* MongoDB Connection */
mongoose
  .connect(
    "mongodb+srv://admin:adadmin@automateddispatch.hwpbl.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.options("*", cors());

// for parsing multi/form-data
app.use(upload.array());
app.use(express.static("public"));

// routes
app.use("/auth", authRoute);
app.use("/bookings", bookingsRoute);
app.use("/employees", employeesRoute);
app.use("/vehicles", vehiclesRoute);
app.use("/settings", settingsRoute);
app.use("/users", usersRoute);
app.use("/booking-forms", bookingFormsRoute);
app.use("/calendars", calendarsRoute);
app.use("/verification", verificationRoute);
app.use("/notifications", notificationsRoute);
app.use("/estimate", estimateRoute);

app.listen(8800, () => {
  console.log("Backend server is running at port 8800!");
});

// Health check
app.get('/', (req, res) => {
  res.sendStatus(200)
})

schedule.scheduleJob("*/30 */20 * * *", dailyNotifications);
