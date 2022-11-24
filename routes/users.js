const router = require("express").Router();

const verifyToken = require("../middlewares/authJWT");
const Users = require("../models/Users");

router.use(verifyToken);

router.get("/me", async (req, res) => {
  try {
    let currentUser = JSON.parse(JSON.stringify(req.user));
    delete currentUser["password"];
    delete currentUser["accessRights"];
    res.status(200).json(currentUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create User
router.post("/", async (req, res) => {
  const newUser = new Users(req.body);
  try {
    // if (newUser.role === "tech") {
    //   throw new Error("Not enough permission");
    // }
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update User
router.put("/:id", async (req, res) => {
  try {
    const updatedData = await Users.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { returnOriginal: false }
    );
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    await user.deleteOne();
    res.status(200).json({ message: "User has been deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all users
router.get("/", async (req, res) => {
  try {
    const userList = await Users.find();
    res.send(userList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
