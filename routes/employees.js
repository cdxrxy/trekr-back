const router = require("express").Router();
const verifyToken = require("../middlewares/authJWT");
const Employees = require("../models/Employees");

router.use(verifyToken);

// Get all employees
router.get("/list", async (req, res) => {
  try {
    const employeeList = await Employees.findOne();
    res.send(employeeList);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create employees
router.post("/", async (req, res) => {
  const newEmployees = new Employees(req.body);
  newEmployees.ownerId = req.user._id;
  try {
    const savedEmployees = await newEmployees.save();
    res.status(200).json(savedEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update owner's employees (add)
router.put("/add", async (req, res) => {
  try {
    const updatedEmployees = await Employees.findOneAndUpdate(
      { ownerId: req.user._id },
      { $push: { employees: req.body } },
      { runValidators: true, new: true }
    );
    res.send(updatedEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update owner's concrete employee
router.put("/", async (req, res) => {
  try {
    const updatedEmployees = await Employees.findOneAndUpdate(
      { ownerId: req.user._id, "employees._id": req.body._id },
      { $set: { "employees.$": req.body } },
      { runValidators: true, new: true }
    );
    res.send(updatedEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete owner's concrete employee
router.delete("/", async (req, res) => {
  try {
    const deletedEmployee = await Employees.findOneAndUpdate(
      { ownerId: req.user._id },
      { $pull: { employees: { _id: req.body._id } } },
      { new: true }
    );
    res.send(deletedEmployee);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get owner's employees
router.get("/", async (req, res) => {
  try {
    if (req.body._id) {
      const myEmployee = await Employees.findOne(
        {
          ownerId: req.user._id,
          "employees._id": req.body._id,
        },
        { "employees.$": 1, _id: 0 }
      );
      return res.send(myEmployee.employees[0]);
    }
    const ownerEmployees = await Employees.findOne({ ownerId: req.user._id });
    res.send(ownerEmployees);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
