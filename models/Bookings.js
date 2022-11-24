const mongoose = require("mongoose");

const { eventTypes, eventStatus, inputTypes } = require("../constants/enums");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const BookingsSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    settingsId: {
      type: Schema.Types.ObjectId,
      ref: "Settings",
      required: true,
    },
    bookings: {
      type: Schema.Types.Map,
      of: [
        {
          _id: String,
          // just a date, and it will be used as key of map
          date: {
            type: String,
            required: true,
          },
          // stored in format HH:MM
          startTime: {
            type: String,
            required: true,
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
          statusToken: { type: String, required: true },
          statusTokenIssuedAt: { type: Date, required: true },
          fullname: {
            type: String,
            required: true,
          },
          email: {
            type: String,
            required: true,
          },
          phone: {
            type: String,
            required: true,
          },
          properties: {
            type: [
              {
                propertyType: {
                  type: String,
                  default: inputTypes.values.text,
                },
                label: String,
                value: String,
              },
            ],
            default: [],
          },
          estimate: {
            employees: {
              type: [
                {
                  type: Schema.Types.ObjectId,
                  ref: "Employees",
                },
              ],
              default: [],
            },
            vehicles: {
              type: [
                {
                  type: Schema.Types.ObjectId,
                  ref: "Vehicles",
                },
              ],
              default: [],
            },
            hourlyRate: {
              type: Number,
              required: true,
            },
            gasFee: {
              type: Number,
              required: true,
            },
            additionalFee: {
              type: Number,
              required: true,
            },
            estimatedTime: {
              type: Number,
              required: true,
            },
            totalCost: {
              type: Number,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
          },
        },
      ],
      default: {},
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Bookings || mongoose.model("Bookings", BookingsSchema);
