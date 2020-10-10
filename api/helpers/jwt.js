const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "JWT create token",

  description: "Jwt create token for logged in user.",

  inputs: {
    user: {
      type: "json",
      description: "User object to be signed from jsonwebtoken sign method.",
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
      var token = jwt.sign({ user: inputs.user }, sails.config.custom.secret, {
        algorithm: 'HS256',
        issuer: sails.config.custom.issuer,
        audience: sails.config.custom.audience,
      });

      return exits.success({
        token: token,
      });
    } catch (error) {
      return exits.invalid({ message: "Oops there is a problem." });
    }
  },
};
