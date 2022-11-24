const router = require("express").Router();
const _ = require("lodash");

const verifyToken = require("../middlewares/authJWT");
const Bookings = require("../models/Bookings");

router.use(verifyToken);

// get all owners bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Bookings.findOne({
      ownerId: req.user._id,
    });

    res.send(_.get(bookings, "bookings", []));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/get", async (req, res) => {
  try {
    const { id, date } = req.query;
    const selectedBooking = await Bookings.findOne(
      {
        ownerId: req.user._id,
      },
      { [`bookings.${date}`]: 1 }
    );

    res.send(
      selectedBooking.bookings.get(date).filter((item) => item._id === id)[0]
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/:selectedDay", async (req, res) => {
  try {
    const selectedDay = req.params.selectedDay;
    const selectedBookings = await Bookings.findOne(
      {
        ownerId: req.user._id,
      },
      { [`bookings.${selectedDay}`]: 1 }
    );
    const selectedResult = selectedBookings.bookings.get(selectedDay);
    if (_.isEmpty(selectedResult)) {
      return res.send([]);
    }
    res.send(selectedResult);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
});

// Post Bookings
router.post("/", async (req, res) => {
  const { startDate, endDate } = req.body;

  const bookingStartDate = new Date(startDate);
  const bookingEndDate = new Date(endDate);

  if (new Date() > bookingStartDate || new Date() > bookingEndDate) {
    return res
      .status(400)
      .json({ message: "Booking for past days is unavailable" });
  }

  // Check if start date is less than end date
  if (bookingStartDate >= bookingEndDate) {
    return res
      .status(400)
      .json({ message: "Starting time should be before than the ending time" });
  }

  let today = new Date(startDate).toISOString().split("T")[0];
  let tomorrow = new Date(startDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow = tomorrow.toISOString().split("T")[0];

  // Get all bookings in that day
  const reservedBookings = await Bookings.find({
    startDate: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  let alreadyReserved = false;

  // Check if two date ranges overlap
  for (let index = 0; index < reservedBookings.length; index++) {
    const booking = reservedBookings[index];
    if (
      bookingStartDate <= booking.endDate &&
      bookingEndDate >= booking.startDate
    ) {
      alreadyReserved = true;
      break;
    }
  }

  if (alreadyReserved) {
    return res.status(400).json({ message: "Already reserved time" });
  } else {
    const newBooking = new Bookings({
      ...req.body,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
    try {
      const savedBooking = await newBooking.save();
      res.status(200).json(savedBooking);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

// Update Bookings
router.put("/", async (req, res) => {
  try {
    const { keyDate, bookingEventId, estimate, date, startTime } = req.body;
    if (keyDate != date) {
      const myBooking = (
        await Bookings.findOne(
          { [`bookings.${keyDate}._id`]: bookingEventId },
          { [`bookings.${keyDate}.$`]: 1 }
        )
      ).bookings.get(keyDate)[0];
      myBooking.date = date;
      myBooking.startTime = startTime;
      myBooking.estimate = estimate;
      await Bookings.findOneAndUpdate(
        {
          [`bookings.${keyDate}._id`]: bookingEventId,
        },
        {
          $pull: { [`bookings.${keyDate}`]: { _id: bookingEventId } },
          $push: { [`bookings.${date}`]: myBooking },
        }
      );
    } else {
      await Bookings.findOneAndUpdate(
        { [`bookings.${keyDate}._id`]: bookingEventId },
        {
          [`bookings.${keyDate}.$.estimate`]: estimate,
          [`bookings.${keyDate}.$.date`]: date,
          [`bookings.${keyDate}.$.startTime`]: startTime,
        }
      );
    }
    res.send("Bookings has been updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/bookingEvent", async (req, res) => {
  try {
    await Bookings.findOneAndUpdate(
      { $text: { $search: req.body._id } },
      { $pull: { [`bookings.${req.body.date}`]: { _id: req.body._id } } }
    );
    res.send("Booking has been deleted");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Delete Bookings
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id);
    await booking.deleteOne();
    res.status(200).json("the post has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Bookings
router.get("/list", async (req, res) => {
  try {
    const bookingsList = await Bookings.find({});

    res.send(bookingsList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Bookings for a selected date
router.get("/list/:date", async (req, res) => {
  try {
    const selectedDate = req.params.date;

    let today = new Date(selectedDate);
    today.setDate(today.getDate() + 1);
    today = today.toISOString().split("T")[0];
    let tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow = tomorrow.toISOString().split("T")[0];

    const bookingsList = await Bookings.find({
      startDate: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // TODO: check if day is full

    res.send({ list: bookingsList, full: false });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
