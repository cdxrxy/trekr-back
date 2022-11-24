const router = require("express").Router();

const verifyToken = require("../middlewares/authJWT");
const Notifications = require("../models/Notifications");

router.use(verifyToken);

//Get all notifications
router.get("/list", async (req, res) => {
  try {
    const notificationList = await Notifications.find();
    res.send(notificationList);
  } catch (err) {
    res.status(500).send(err);
  }
});

//Get owner's notification
router.get("/", async (req, res) => {
  try {
    const ownerNotification = await Notifications.findOne({
      ownerId: req.user._id,
    });
    if (req.body.bookingEventId) {
      const myNotification = ownerNotification.events.find(
        (event) => event.bookingEventId === req.body.bookingEventId
      );
      res.send(myNotification);
    } else {
      res.send(ownerNotification);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

//Update isSeen
router.put("/", async (req, res) => {
  try {
    await Notifications.findOneAndUpdate(
      { "events.bookingEventId": req.body.bookingEventId },
      { "events.$.isSeen": req.body.isSeen }
    );
    res.send("Success");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Update isSeen for all notifications
router.put("/all", async (req, res) => {
  try {
    const notifications = await Notifications.findOne({
      ownerId: req.user._id,
    });

    const updatedEvents = notifications.events;
    updatedEvents.forEach(
      (element, index) => (updatedEvents[index].isSeen = req.body.isSeen)
    );

    await Notifications.findOneAndUpdate(
      { ownerId: req.user._id },
      { events: updatedEvents }
    );

    res.send("Success");
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//Delete owner's concrete event
router.delete("/", async (req, res) => {
  try {
    await Notifications.findOneAndUpdate(
      { ownerId: req.user._id },
      { $pull: { events: { bookingEventId: req.body.eventId } } },
      { multi: true }
    );
    res.send("Success");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
