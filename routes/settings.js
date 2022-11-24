const router = require("express").Router();

const {
  saveOrUpdateSettings,
  getSettings,
} = require("../controllers/settings.controller");
const verifyToken = require("../middlewares/authJWT");

router.use(verifyToken);

// Update Settings
router.put("/", saveOrUpdateSettings);

// Get Settings
router.get("/", getSettings);

module.exports = router;
