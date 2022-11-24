const router = require("express").Router();

const verifyToken = require("../middlewares/authJWT");
const Calendars = require("../models/Calendars");
const Bookings = require("../models/Bookings");

router.use(verifyToken);

//Get all calendars
router.get("/list", async (req, res) => {
  try {
    const calendarList = await Calendars.find();
    res.send(calendarList);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create calendar
router.post("/", async (req, res) => {
  try {
    const newCalendar = new Calendars(req.body);
    newCalendar.ownerId = req.user._id;
    const savedCalendar = await newCalendar.save();
    res.send(savedCalendar);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get owner's calendar
router.get("/", async (req, res) => {
  try {
    const ownerCalendar = await Calendars.findOne({ ownerId: req.user._id });
    res.send(ownerCalendar);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get public or private calendar
router.get("/:id", async (req, res) => {
  try {
    const privateCalendar = await Calendars.findById(req.params.id);
    if (!privateCalendar.ownerId.equals(req.user._id)) {
      const publicCalendar = await Calendars.findById(req.params.id);
      const publicBookings = await Bookings.findById(publicCalendar.bookings);
      const publicResponse = {
        date: publicBookings.date,
        startDateTime: publicBookings.startDateTime,
        endDateTime: publicBookings.endDateTime,
      };
      res.send(publicResponse);
    } else {
      res.send(privateCalendar);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update calendar
router.put("/", async (req, res) => {
  try {
    const updatedCalendar = await Calendars.findOneAndUpdate(
      { ownerId: req.user._id },
      req.body,
      { new: true }
    );
    res.send(updatedCalendar);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete calendar
router.delete("/", async (req, res) => {
  try {
    const deletedCalendar = await Calendars.findOneAndDelete({
      ownerId: req.user._id,
    });
    res.send(deletedCalendar);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
