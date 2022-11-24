const Settings = require("../models/Settings");

const saveOrUpdateSettings = async (req, res) => {
  try {
    const updatedData = await Settings.findOneAndUpdate(
      { ownerId: req.user._id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSettings = async (req, res) => {
  try {
    const settingsList = await Settings.findOne({
      ownerId: req.user._id,
    });

    res.send(settingsList);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { saveOrUpdateSettings, getSettings };
