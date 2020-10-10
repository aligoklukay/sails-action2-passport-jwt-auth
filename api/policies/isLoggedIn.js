// policies/isLoggedIn.js
var passport = require("passport");
module.exports = async function (req, res, proceed) {
  passport.authenticate("jwt", function (error, user, info) {
    if (error) return res.serverError(error);
    if (!user)
      return res.json(null, info && info.code, info && info.message);
    req.user = user;

    next();
  })(req, res);
};
