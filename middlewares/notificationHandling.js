require("dotenv").config();
const sendGridMailer = require("@sendgrid/mail");

sendGridMailer.setApiKey(process.env.SEND_GRID_API_SECRET);

const Notifications = require("../models/Notifications");
const Users = require("../models/Users");
const { eventStatus } = require("../constants/enums");
const clientEmailTemplateUtil = require("../utils/clientEmailTemplate");
const ownerEmailTemplateUtil = require("../utils/ownerEmailTemplate");

const notificationHandling = async (req, res) => {
  try {
    req.body.eventStatus = eventStatus.values.pending;
    req.body.bookingEventId = req.concreteBookingId;

    const bookingId = req.concreteBookingId;
    const date = req.message.date;

    const clientFullname = req.message.fullname;
    const clientPhone = req.message.phone;
    const clientEmail = req.message.email;

    await Notifications.findOneAndUpdate(
      {
        ownerId: req.ownerId,
      },
      { $push: { events: req.body } }
    );

    const owner = await Users.findById(req.ownerId);
    const ownerFullname = owner.fullname;
    const ownerEmail = owner.email;

    const ownerEmailTemplate = ownerEmailTemplateUtil(
      bookingId,
      date,
      ownerFullname,
      clientFullname,
      clientPhone,
      clientEmail
    );

    await sendGridMailer.send({
      to: ownerEmail,
      from: {
        email: "flamelmamel2907@gmail.com",
        name: "Notification Mailer",
      },
      subject: "You have a new notification",
      html: ownerEmailTemplate,
    });

    const clientEmailTemplate = clientEmailTemplateUtil(
      bookingId,
      date,
      clientFullname
    );

    await sendGridMailer.send({
      to: clientEmail,
      from: {
        email: "flamelmamel2907@gmail.com",
        name: "Notification Mailer",
      },
      subject: "You have a new notification",
      html: clientEmailTemplate,
    });

    res.send({ message: "Form was received, notification was sent" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = notificationHandling;
