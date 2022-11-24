const { Schema, model } = require("mongoose");

const { eventTypes, eventStatus } = require("../constants/enums");

const NotificationSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  settingsId: {
    type: Schema.Types.ObjectId,
    ref: "Settings",
  },
  events: {
    type: [
      {
        bookingEventId: String,
        creationDate: {
          type: Schema.Types.Date,
          default: new Date(),
        },
        eventType: {
          type: String,
          enum: {
            values: Object.values(eventTypes.values),
            message: eventTypes.message,
          },
          default: eventTypes.values.request,
        },
        eventStatus: {
          type: String,
          enum: {
            values: Object.values(eventStatus.values),
            message: eventStatus.message,
          },
          default: eventStatus.values.received,
        },
        isSeen: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  hasNew: {
    type: Boolean,
    default: false,
  },
});

module.exports = model("Notifications", NotificationSchema);
