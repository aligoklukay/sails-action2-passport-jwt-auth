var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require('bcrypt');

//Local strategy config
var LOCAL_STRATEGY_CONFIG = {
  usernameField: "email",
  passwordField: "password",
};

//JWT strategy config
var JWT_STRATEGY_CONFIG = {
  secretOrKey : '3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  audience : 'localhost',
  issuer: 'localhost',
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
};

//Local strategy check user.
async function _onLocalStrategyAuth(email, password, next) {
  //Find user with email
  var user = await User.findOne({
    email: email,
  });
  //If user doesnt exist
  if (!user) {
    return next(null, false, {
      status: false,
      message: `${email} is not found.`,
    });
  }
  //If password doesnt match.
  if (!(await bcrypt.compare(password, user.password)))
    return next(null, false, {
      code: "E_WRONG_PASSWORD",
      message: "Password is wrong",
    });

  return next(null, user, {});
}

//Jwt login strategy
async function _onJwtStrategyAuth(payload, next) {
  var user = payload.user;
  return next(null, user, {});
}

passport.use(new LocalStrategy(LOCAL_STRATEGY_CONFIG, _onLocalStrategyAuth));
passport.use(new JwtStrategy(JWT_STRATEGY_CONFIG, _onJwtStrategyAuth));
