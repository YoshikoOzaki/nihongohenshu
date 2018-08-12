module.exports = {


  friendlyName: 'Get Glass',


  description: 'Get glasses',


  extendedDescription:
  `Returns all glass types and info`,

  inputs: {
  },

  exits: {
  },


  fn: async function (inputs, exits) {
    // var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newRecord = await Glass.find();

    // Since everything went ok, send our 200 response.
    return exits.success(newRecord);
  }

};
