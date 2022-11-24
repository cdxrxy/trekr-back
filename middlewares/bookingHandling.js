const Bookings = require("../models/Bookings");
const BookingForms = require("../models/BookingForms");
const Calendars = require("../models/Calendars");
const { v4: uuidV4 } = require("uuid");

const { eventStatus } = require("../constants/enums");

const bookingHandling = async (req, res, next) => {
  try {
    const { bookingId, ownerId, calendarId } = await BookingForms.findById(
      req.body._id
    );
    const myCalendar = await Calendars.findById(calendarId);
    const { date, startTime, fullname, email, phone, ...rest } =
      req.body.properties;

    const selectedBookings = myCalendar.bookings.get(date);

    if (selectedBookings) {
      for (let i = 0; i < selectedBookings.length; i++) {
        if (
          startTime <= selectedBookings[i].endTime &&
          startTime >= selectedBookings[i].startTime
        ) {
          return res
            .status(400)
            .send({ message: "Selected time is unavailable" });
        }
      }
    }

    const concreteBookingId = uuidV4() + Date.now();

    let additionalInformation = Object.entries(rest).map((item) => ({
      label: item[0],
      value: item[1],
    }));

    await Bookings.findByIdAndUpdate(bookingId, {
      $push: {
        [`bookings.${date}`]: {
          _id: concreteBookingId,
          date,
          startTime,
          eventStatus: eventStatus.values.pending,
          statusToken: uuidV4() + new Date().getTime(),
          statusTokenIssuedAt: new Date().toISOString(),
          fullname,
          email,
          phone,
          properties: additionalInformation,
        },
      },
    });

    delete req.body["properties"];
    delete req.body["_id"];
    req.ownerId = ownerId;
    req.message = {
      date,
      startTime,
      fullname,
      email,
      phone,
    };
    req.concreteBookingId = concreteBookingId;
    next();
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = bookingHandling;
