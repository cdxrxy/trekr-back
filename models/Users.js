const mongoose = require("mongoose");

const { roles } = require("../constants/enums");

const { Schema } = mongoose;
mongoose.Promise = global.Promise;

const UsersSchema = new Schema(
  {
    isSubscribedFeed: {
      type: Boolean,
      default: false,
    },
    isPermitted: {
      type: Boolean,
      default: false,
    },
    emailToken: {
      type: String,
      default: "",
    },
    fullname: {
      type: String,
      required: [true, "Fullname not provided "],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email not provided"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    phone: {
      type: String,
      min: 10,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roles.values),
        message: roles.message,
      },
      default: "owner",
    },
    password: {
      type: String,
      required: true,
    },
    bookingFormId: {
      type: Schema.Types.ObjectId,
      ref: "BookingForms",
    },
    accessRights: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Users || mongoose.model("Users", UsersSchema);
