const mongoose = require("mongoose");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const { days } = require("../constants/enums");

const weekdayHoursSubSchema = new Schema({
  day: {
    type: String,
    enum: {
      values: Object.values(days.values),
      message: days.message,
    },
  },
  startTime: String,
  endTime: String,
});

const SettingsSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    weekdayHours: {
      type: [weekdayHoursSubSchema],
      default: Object.values(days.values).map((day) => ({
        day: day,
        startTime: "08:00",
        endTime: "19:00",
      })),
    },
    secondShiftStart: {
      type: String,
      default: "17:00",
    },
    timeGap: {
      type: Number,
      default: 10,
    },
    autoRequestConfirm: {
      type: Boolean,
      default: false,
    },
    autoEmailResponder: {
      type: Boolean,
      default: false,
    },
    autoEmployeeEmailing: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
