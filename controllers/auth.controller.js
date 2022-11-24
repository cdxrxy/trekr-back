const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/Users");
const BookingForms = require("../models/BookingForms");
const Bookings = require("../models/Bookings");
const Calendars = require("../models/Calendars");
const Employees = require("../models/Employees");
const Notifications = require("../models/Notifications");
const Settings = require("../models/Settings");
const Vehicles = require("../models/Vehicles");

const ROUNDS = 8;

const signup = async (req, res) => {
  try {
    if (
      !req.body.password.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
      )
    ) {
      return res.status(400).send({
        message:
          "Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      });
    }
    const user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      role: "owner",
      password: bcrypt.hashSync(req.body.password, ROUNDS),
    });

    const candidate = await User.findOne({ email: user.email });
    if (candidate) {
      return res
        .status(400)
        .send({ message: "User with this email already exists" });
    }

    const savedUser = await user.save();

    const settings = await Settings.create({ ownerId: savedUser._id });

    const booking = await Bookings.create({
      ownerId: savedUser._id,
      settingsId: settings._id,
    });

    const calendar = await Calendars.create({
      ownerId: savedUser._id,
      settingsId: settings._id,
    });

    const bookingForm = await BookingForms.create({
      ownerId: savedUser._id,
      calendarId: calendar._id,
      bookingId: booking._id,
    });

    const updatedUser = await User.findByIdAndUpdate(
      savedUser._id,
      { $set: { bookingFormId: bookingForm._id } },
      { new: true }
    );

    await BookingForms.findByIdAndUpdate(bookingForm._id, {
      $set: { link: bookingForm._id },
    });

    await Notifications.create({
      ownerId: savedUser._id,
      settingsId: settings._id,
    });

    await Employees.create({ ownerId: savedUser._id });

    await Vehicles.create({ ownerId: savedUser._id });

    res.send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
};

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
    let token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.API_SECRET,
      {
        expiresIn: 86400 * 30,
      }
    );
    res.send({
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { signin, signup };
