require("dotenv").config();

const router = require("express").Router();
const sendGridMailer = require("@sendgrid/mail");
const crypto = require("crypto");
const _ = require("lodash");
const baseUrl = process.env.BASE_URL

sendGridMailer.setApiKey(process.env.SEND_GRID_API_SECRET);

const verifyToken = require("../middlewares/authJWT");
const Users = require("../models/Users");
const Bookings = require("../models/Bookings");
const Notifications = require("../models/Notifications");
const Calendars = require("../models/Calendars");
const Employees = require("../models/Employees");
const { eventTypes, eventStatus } = require("../constants/enums");
const bookingEmailTemplateUtil = require("../utils/bookingEmailTemplate");

//Verification email
router.post("/send", verifyToken, async (req, res) => {
  try {
    if (req.user.emailToken || req.user.isPermitted) {
      res.redirect("/verification/expired");
    } else {
      const updatedUser = await Users.findByIdAndUpdate(
        req.user._id,
        { emailToken: crypto.randomBytes(64).toString("hex") },
        { new: true }
      );
      await sendGridMailer.send({
        to: req.user.email,
        from: {
          email: "flamelmamel2907@gmail.com",
          name: "Verification Mailer",
        },
        subject: "Email Verification",
        html: `<h1> Hello </h1>
                        <p> Thanks for using our service! <p>
                        <p> Please verify the request you are sending by clicking button below <p>
                        <h1> <a style="text-decoration:none" href="http://${req.headers.host}/verification/request/${updatedUser.emailToken}"> Verify Your Request </a> </h1>`,
      });
      res.send({ message: "We have sent you verification email" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get("/change-status/:statusToken", async (req, res) => {
  const date = req.query.date;

  try {
    const candidateBooking = await Bookings.findOne(
      {
        [`bookings.${date}.statusToken`]: req.params.statusToken,
      },
      { [`bookings.${date}.$`]: 1, ownerId: 1 }
    );
    if (!candidateBooking) {
      return res.status(400).send({ message: "Invalid status token" });
    }

    if (
      new Date().getTime() -
        new Date(
          candidateBooking.bookings.get(date)[0].statusTokenIssuedAt
        ).getTime() >
      43200000
    ) {
      return res.redirect(`${baseUrl}/confirmation-page/expired`);
    }

    const startTime = candidateBooking.bookings.get(date)[0].startTime;
    const endTime = candidateBooking.bookings.get(date)[0].estimate.endTime;
    const clientFullname = candidateBooking.bookings.get(date)[0].fullname;
    const clientEmail = candidateBooking.bookings.get(date)[0].email;
    const clientPhone = candidateBooking.bookings.get(date)[0].phone;
    const ownerId = candidateBooking.ownerId;
    const concreteBookingId = candidateBooking.bookings.get(date)[0]._id;
    const estimateEmployeeIds =
      candidateBooking.bookings.get(date)[0].estimate.employees;

    if (
      candidateBooking.bookings.get(date)[0].eventStatus ===
      eventStatus.values.rejected
    ) {
      return res.status(400).send("Booking has been already canceled");
    }

    if (req.query.eventStatus === "confirmed") {
      if (
        candidateBooking.bookings.get(date)[0].eventStatus ===
        eventStatus.values.confirmed
      ) {
        return res.status(400).send("Booking has been already confirmed");
      }
      const myCalendar = await Calendars.findOne({ ownerId });
      const selectedBookings = myCalendar.bookings.get(date);
      if (selectedBookings) {
        for (let i = 0; i < selectedBookings.length; i++) {
          if (
            startTime <= selectedBookings[i].endTime &&
            startTime >= selectedBookings[i].startTime
          ) {
            return res.status(400).send("Selected time is unavailable");
          }
        }
      }

      await Calendars.findOneAndUpdate(
        { ownerId },
        {
          $push: {
            [`bookings.${date}`]: {
              date,
              startTime,
              endTime,
              _id: concreteBookingId,
            },
          },
        }
      );
    } else {
      await Calendars.findOneAndUpdate(
        { ownerId },
        {
          $pull: {
            [`bookings.${date}`]: { startTime },
          },
        }
      );
    }

    await Bookings.findOneAndUpdate(
      {
        [`bookings.${date}._id`]: concreteBookingId,
      },
      {
        $set: {
          [`bookings.${date}.$.eventStatus`]:
            eventStatus.values[`${req.query.eventStatus}`],
          [`bookings.${date}.$.eventType`]:
            req.query.eventStatus === "confirmed"
              ? eventTypes.values.booking
              : eventTypes.values.request,
        },
      }
    );

    const newNotification = {
      bookingEventId: concreteBookingId,
      eventStatus: eventStatus.values[`${req.query.eventStatus}`],
      eventType:
        req.query.eventStatus === "confirmed"
          ? eventTypes.values.booking
          : eventTypes.values.request,
      isSeen: true,
    };

    await Notifications.findOneAndUpdate(
      { ownerId },
      { $push: { events: newNotification } }
    );

    const ownerEmail = (await Users.findById(ownerId)).email;
    const employeeEmails = [];
    if (estimateEmployeeIds.length > 0) {
      for (let i = 0; i < estimateEmployeeIds.length; i++) {
        const currentEmployee = await Employees.findOne(
          {
            "employees._id": estimateEmployeeIds[i],
          },
          { "employees.$": 1 }
        );
        employeeEmails.push(currentEmployee.employees[0].email);
      }
    }
    const recipients = [ownerEmail, clientEmail, ...employeeEmails];
    const filteredRecipients = _.uniq(recipients);

    const templateStatus =
      req.query.eventStatus === "confirmed" ? "confirmed" : "canceled";

    const bookingEmailTemplate = bookingEmailTemplateUtil(
      concreteBookingId,
      date,
      templateStatus,
      startTime,
      endTime,
      clientFullname,
      clientEmail,
      clientPhone
    );

    await sendGridMailer.send({
      to: filteredRecipients,
      from: {
        email: "flamelmamel2907@gmail.com",
        name: "Notification Mailer",
      },
      subject: "Booking Notification",
      html: bookingEmailTemplate,
    });

    res.redirect(
      `${baseUrl}/confirmation-page/${req.query.eventStatus}`
    );
  } catch (err) {
    res.status(500).send(err);
  }
});

//Verification handling
router.get("/request/:emailToken", async (req, res) => {
  try {
    const userToVerify = await Users.findOne({
      emailToken: req.params.emailToken,
    });
    if (userToVerify.isPermitted === true) {
      res.redirect("/verification/success");
    } else {
      await Users.updateOne(
        { emailToken: req.params.emailToken },
        { isPermitted: true }
      );
      res.send("You have successfully verified your request");
    }
  } catch (err) {
    res.redirect("/verification/expired");
  }
});

router.get("/success", async (req, res) => {
  res.send("You have already verified your request ");
});

router.get("/expired", async (req, res) => {
  res.send("Link has been expired");
});

module.exports = router;
