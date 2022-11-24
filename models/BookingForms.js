const mongoose = require("mongoose");
const { inputTypes } = require("../constants/enums");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const BookingFormsSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    calendarId: {
      type: Schema.Types.ObjectId,
      ref: "Calendars",
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Bookings",
    },
    bookingForm: {
      link: {
        type: String,
        default: "",
      },
      properties: {
        type: [
          {
            propertyType: {
              type: String,
              enum: Object.values(inputTypes.values),
            },
            label: String,
            desc: String,
            required: Boolean,
            permanent: Boolean,
            options: [String],
          },
        ],
        default: [
          {
            propertyType: inputTypes.values.dateTime,
            label: "Date",
            desc: "",
            required: true,
            permanent: true,
          },
          {
            propertyType: inputTypes.values.text,
            label: "Fullname",
            desc: "",
            required: true,
            permanent: true,
          },
          {
            propertyType: inputTypes.values.email,
            label: "Email",
            desc: "",
            required: true,
            permanent: true,
          },
          {
            propertyType: inputTypes.values.phone,
            label: "Phone",
            desc: "",
            required: true,
            permanent: true,
          },
        ],
      },
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.BookingFormsSchema ||
  mongoose.model("bookingForms", BookingFormsSchema);
