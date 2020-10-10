const passport = require("passport");

async function _onPassportAuth(req, res, error, user, info) {
  if (error) return res.json(error);
  if (!user) return res.unauthorized(null, info && info.code, info && info.message);

  return res.ok({
    token: await sails.helpers.jwt(user),
    user: user
  });
}

module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    user: {
      type: "json",
    },
    info: {
      type: "json",
    },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "JWT returned succesfully.",
    },
    invalid: {
      description: "The provided values are invalid",
      extendedDescription:
        "If this request was sent from a graphical user interface, the request " +
        "parameters should have been validated/coerced _before_ they were sent.",
      statusCode: 400,
    },
    errorRequest: {
      statusCode: 500,
    },
  },

  fn: async function (inputs, exits) {
    try {
      passport.authenticate('local',
      _onPassportAuth.bind(this, this.req, this.res))(this.req, this.res);
    } catch (error) {
      console.log(error);
      return exits.invalid({ message: "Oops there is a problem." });
    }
  },
};
