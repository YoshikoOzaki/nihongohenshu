module.exports = {


  friendlyName: 'Get Glass',


  description: 'Get glass',


  extendedDescription:
  `Returns one glass types and info`,

  inputs: {
    id: {
      description: 'The glass id',
      example: '1',
      required: true
    }
  },

  exits: {
  },


  fn: async function (inputs, exits) {
    // var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newRecord = await Glass.findOne({ id: inputs.id });

    // Since everything went ok, send our 200 response.
    return exits.success(newRecord);
  }

};
