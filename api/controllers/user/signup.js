module.exports = {
  friendlyName: "Signup user",

  description: "Signup user method",

  inputs: {
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    password: {
      type: "string",
      required: true,
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
      let userSignup = await User.findOne({
        email: inputs.email,
      });

      if (!userSignup) {
        let user = await User.create({
          email: inputs.email,
          password: inputs.password,
        }).fetch();

        return exits.success({
          status: true,
          user,
          token: await sails.helpers.jwt(user),
        });
      } else {
        return exits.invalid({ status: false, message: "The mail you have entered is already signed in our system." });
      }
    } catch (error) {
      console.log(error);
      return exits.errorRequest({
        status: false,
        message: "A problem occured.",
      });
    }
  },
};
