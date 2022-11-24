const verifyEmail = async (req, res, next) => {
  if (!req.user.isPermitted) {
    return res.status(403).send({ message: "Verify your request" });
  }
  next();
};

module.exports = verifyEmail;
