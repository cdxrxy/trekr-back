const router = require("express").Router();

const verifyToken = require("../middlewares/authJWT");
const BookingForms = require("../models/BookingForms");
const Calendars = require("../models/Calendars");
const Settings = require("../models/Settings");
const bookingHandling = require("../middlewares/bookingHandling");
const notificationHandling = require("../middlewares/notificationHandling");

// Get all booking forms
router.get("/list", verifyToken, async (req, res) => {
  try {
    const bookingFormList = await BookingForms.find();
    res.send(bookingFormList);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Create booking form
router.post(
  "/",
  (req, res, next) => {
    if (!req.body._id) {
      return res.status(400).send("Invalid form id");
    }

    if (new Date(req.body.properties.date) < new Date()) {
      return res
        .status(400)
        .send({ message: "Booking for past time is unavailable" });
    }

    next();
  },
  bookingHandling,
  notificationHandling
);

// Update owner's booking form property
router.put("/", verifyToken, async (req, res) => {
  if (!req.body.properties) {
    return res.status(400).send({ message: "Invalid properties" });
  }
  try {
    const updatedBookingForms = await BookingForms.findOneAndUpdate(
      { ownerId: req.user._id },
      { $set: { "bookingForm.properties": req.body.properties } },
      { runValidators: true, new: true }
    );
    res.send(updatedBookingForms);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Delete owner's concrete booking form
router.delete("/", verifyToken, async (req, res) => {
  try {
    const bookingForm = await BookingForms.findOne({ ownerId: req.user._id });
    delete bookingForm["bookingForm"];
    const deletedBookingForm = await bookingForm.save();
    res.send(deletedBookingForm);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get owner's booking forms
router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    return res.send({ message: "Invalid form id" });
  }
  try {
    const { calendarId, bookingForm } = await BookingForms.findById(
      req.params.id
    );
    const { settingsId, bookings } = await Calendars.findById(calendarId);
    const { weekdayHours, secondShiftStart, timeGap } = await Settings.findById(
      settingsId
    );
    res.send({
      bookings,
      weekdayHours,
      secondShiftStart,
      timeGap,
      bookingForm,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
