const { Schema, model } = require("mongoose");
const { eventStatus, eventTypes } = require("../constants/enums");

const CalendarSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  settingsId: {
    type: Schema.Types.ObjectId,
    ref: "Settings",
  },
  bookings: {
    type: Schema.Types.Map,
    of: [
      {
        _id: String,
        // just a date, and it will be used as key of map
        date: {
          type: Date,
        },
        // stored in secs, starting from 00:00
        startTime: {
          type: String,
        },
        endTime: {
          type: String,
        },
      },
    ],
    default: {},
  },
  pendings: {
    type: Schema.Types.Map,
    of: [
      {
        date: {
          type: Date,
        },
      },
    ],
    default: {},
  },
});

module.exports = model("Calendars", CalendarSchema);
