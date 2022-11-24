const router = require("express").Router();

const verifyToken = require("../middlewares/authJWT");
const Vehicles = require("../models/Vehicles");

router.use(verifyToken);

// Get all vehicles
router.get("/list", async (req, res) => {
  try {
    const VehiclesList = await Vehicles.find();
    res.send(VehiclesList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create vehicle
router.post("/", async (req, res) => {
  const newVehicle = new Vehicles(req.body);
  newVehicle.ownerId = req.user._id;
  try {
    const savedVehicle = await newVehicle.save();
    res.status(200).json(savedVehicle);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update owner's vehicles (add)
router.put("/add", async (req, res) => {
  try {
    const updatedVehicles = await Vehicles.findOneAndUpdate(
      { ownerId: req.user._id },
      { $push: { vehicles: req.body } },
      { runValidators: true, new: true }
    );
    res.send(updatedVehicles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update owner's concrete vehicle
router.put("/", async (req, res) => {
  try {
    const updatedVehicles = await Vehicles.findOneAndUpdate(
      { ownerId: req.user._id, "vehicles._id": req.body._id },
      { $set: { "vehicles.$": req.body } },
      { runValidators: true, new: true }
    );
    res.send(updatedVehicles);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete owner's concrete vehicle
router.delete("/", async (req, res) => {
  try {
    const deletedVehicle = await Vehicles.findOneAndUpdate(
      { ownerId: req.user._id },
      { $pull: { vehicles: { _id: req.body._id } } },
      { new: true }
    );
    res.send(deletedVehicle);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get owner's vehicles
router.get("/", async (req, res) => {
  try {
    if (req.body._id) {
      const myVehicle = await Vehicles.findOne(
        {
          ownerId: req.user._id,
          "vehicles._id": req.body._id,
        },
        { "vehicles.$": 1, _id: 0 }
      );
      return res.send(myVehicle.vehicles[0]);
    }
    const ownerVehicles = await Vehicles.findOne({ ownerId: req.user._id });
    res.send(ownerVehicles);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
