const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.API_SECRET,
      function (err, decode) {
        if (err) req.user = undefined;
        User.findOne({
          _id: decode.id,
        }).exec((err, user) => {
          if (err) {
            res.status(500).send({
              message: err,
            });
          } else {
            req.user = user;
            next();
          }
        });
      }
    );
  } else {
    req.user = undefined;
    return res.status(401).send({
      message: "Only authorized access",
    });
  }
};
module.exports = verifyToken;
