require("dotenv").config();
const router = require("express").Router();
const sendGridMailer = require("@sendgrid/mail");

sendGridMailer.setApiKey(process.env.SEND_GRID_API_SECRET);

const verifyToken = require("../middlewares/authJWT");
const { eventTypes, eventStatus } = require("../constants/enums");

const Bookings = require("../models/Bookings");
const Notifications = require("../models/Notifications");
const Calendars = require("../models/Calendars");
const confirmationClientEmailTemplateUtil = require("../utils/confirmationClientEmailTemplate");

router.use(verifyToken);

router.post("/send/:bookingEventId", async (req, res) => {
  req.body.bookingEvent.eventType = eventTypes.values.estimate;
  req.body.bookingEvent.eventStatus = eventStatus.values.pending;

  if (
    req.body.bookingEvent.startTime > req.body.bookingEvent.estimate.endTime
  ) {
    return res.status(400).send({ message: "Invalid time interval" });
  }

  try {
    const ownerId = req.user._id;
    const ownerBooking = await Bookings.findOne({
      $text: { $search: req.body.bookingEvent._id },
    });

    if (!ownerBooking) {
      return res.status(400).send({ message: "Invalid booking" });
    }

    const concreteBooking = ownerBooking.bookings
      .get(req.body.bookingEvent.date)
      .find((booking) => {
        return booking._id === req.body.bookingEvent._id;
      });

    if (!!concreteBooking?.estimate?.endTime) {
      return res
        .status(400)
        .send({ message: "Booking has been already estimated" });
    }

    const myCalendar = await Calendars.findOne({ ownerId });
    const selectedBookings = myCalendar.bookings.get(
      req.body.bookingEvent.date
    );
    if (selectedBookings) {
      for (let i = 0; i < selectedBookings.length; i++) {
        if (
          req.body.bookingEvent.startTime <= selectedBookings[i].endTime &&
          req.body.bookingEvent.startTime >= selectedBookings[i].startTime
        ) {
          return res
            .status(400)
            .send({ message: "Selected time is unavailable" });
        }
      }
    }

    const statusToken = concreteBooking.statusToken;
    const statusTokenIssuedAt = concreteBooking.statusTokenIssuedAt;
    req.body.bookingEvent.statusToken = statusToken;
    req.body.bookingEvent.statusTokenIssuedAt = statusTokenIssuedAt;

    await Bookings.findOneAndUpdate(
      {
        [`bookings.${req.body.bookingEvent.date}._id`]:
          req.body.bookingEvent._id,
      },
      {
        $set: {
          [`bookings.${req.body.bookingEvent.date}.$`]: req.body.bookingEvent,
        },
      },
      { runValidators: true }
    );

    const newNotification = {
      bookingEventId: req.body.bookingEvent._id,
      eventType: eventTypes.values.estimate,
      eventStatus: eventStatus.values.pending,
      isSeen: true,
    };
    await Notifications.findOneAndUpdate(
      {
        ownerId,
      },
      { $push: { events: newNotification } }
    );

    const confirmationClientEmailTemplate = confirmationClientEmailTemplateUtil(
      req.body.bookingEvent._id,
      req.body.bookingEvent.date,
      req.body.bookingEvent.startTime,
      concreteBooking.fullname,
      req.body.bookingEvent.estimate,
      statusToken
    );

    await sendGridMailer.send({
      to: req.body.bookingEvent.email,
      from: {
        email: "flamelmamel2907@gmail.com",
        name: "Notification Mailer",
      },
      subject: "You have new notifications",
      html: confirmationClientEmailTemplate,
    });

    res.send("Booking was estimated");
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
