require("dotenv").config();
const sendGridMailer = require("@sendgrid/mail");
const { eventStatus } = require("../constants/enums");

sendGridMailer.setApiKey(process.env.SEND_GRID_API_SECRET);

const Users = require("../models/Users");
const Bookings = require("../models/Bookings");
const Settings = require("../models/Settings");
const Employees = require("../models/Employees");

const dailyNotifications = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const keyDate = tomorrow.toISOString().split("T")[0];

    const todayDate = new Date().toISOString().split("T")[0];

    const ownerList = await Users.find();
    const ownerIdList = ownerList.map((user) => user._id);
    const ownerEmailList = ownerList.map((user) => user.email);

    for (let i = 0; i < ownerIdList.length; i++) {
      const currentEmployees = await Employees.findOne({
        ownerId: ownerIdList[i],
      });
      const currentEmployeesEmailList = currentEmployees.employees.map(
        (employee) => employee.email
      );

      const currentSettings = await Settings.findOne({
        ownerId: ownerIdList[i],
      });

      const bookingDate = new Date();
      bookingDate.setDate(
        bookingDate.getDate() + currentSettings.autoEmployeeEmailing
      );
      const keyForBooking = bookingDate.toISOString().split("T")[0];

      const autoEmailingBookings = await Bookings.findOne(
        {
          ownerId: ownerIdList[i],
          [`bookings.${keyForBooking}.eventStatus`]:
            eventStatus.values.confirmed,
        },
        { [`bookings.${keyForBooking}`]: 1, _id: 0 }
      );
      let confirmedAutoEmailingBookings = [];
      if (autoEmailingBookings) {
        confirmedAutoEmailingBookings = autoEmailingBookings.bookings
          .get(keyForBooking)
          .filter(
            (booking) => booking.eventStatus === eventStatus.values.confirmed
          );
      }

      if (
        currentEmployeesEmailList.length > 0 &&
        confirmedAutoEmailingBookings.length > 0
      ) {
        await sendGridMailer.send({
          to: currentEmployeesEmailList,
          from: {
            email: "flamelmamel2907@gmail.com",
            name: "Notification Mailer",
          },
          subject: "Auto Emailing",
          html: `<h1> Hello, this is your auto emailing notification </h1>
                  <p> Bookings for ${currentSettings.autoEmployeeEmailing} days forward:
                  ${confirmedAutoEmailingBookings}</p>
                      <p> Thanks for using our service! </p>`,
        });
      }

      const tomorrowBookings = await Bookings.findOne(
        {
          ownerId: ownerIdList[i],
          [`bookings.${keyDate}.eventStatus`]: eventStatus.values.confirmed,
        },
        { [`bookings.${keyDate}`]: 1, _id: 0 }
      );
      let tomorrowConfirmedBookings = [];
      if (tomorrowBookings) {
        tomorrowConfirmedBookings = tomorrowBookings.bookings
          .get(keyDate)
          .filter(
            (booking) => booking.eventStatus === eventStatus.values.confirmed
          );
      }

      const todayBookings = await Bookings.findOne(
        {
          ownerId: ownerIdList[i],
        },
        { [`bookings.${todayDate}`]: 1, _id: 0 }
      );
      let messageTodayBookings = [];
      if (todayBookings.bookings.get(todayDate)) {
        messageTodayBookings = todayBookings.bookings.get(todayDate);
      }

      await sendGridMailer.send({
        to: ownerEmailList[i],
        from: {
          email: "flamelmamel2907@gmail.com",
          name: "Notification Mailer",
        },
        subject: "Brief review",
        html: `<h1> Hello, this is your brief review of today </h1>
                    <p> Bookings of this day: ${
                      messageTodayBookings.length === 0
                        ? "You haven't had any bookings today"
                        : messageTodayBookings
                    } </p>
                    <p> Confirmed bookings for the next day: ${
                      tomorrowConfirmedBookings.length === 0
                        ? "You don't have any bookings for the next day"
                        : tomorrowConfirmedBookings
                    } </p>
                      <p> Thanks for using our service! </p>`,
      });
    }
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = dailyNotifications;
