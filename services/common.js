
const passport = require("passport");

// to check whether user is login or not
exports.isAuth = (req, res, done) => {

  return passport.authenticate("jwt");
};
// for returning the value
exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};
// for extracting the cookie
exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};
