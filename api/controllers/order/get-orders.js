module.exports = {


  friendlyName: 'Get orders',


  description: 'Get orders for a given user',


  inputs: {
    UserId: {
      type: 'number',
      description: 'The user id',
      example: 1,
      required: true
    },
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: ''
    },
  },


  fn: async function (inputs, exits) {
    try {
      var records = await Order.find(
        {
          User: inputs.UserId,
        }
      ).populate('OrderLineNumbers');;
      return exits.success(records);
    } catch (err) {
      return exits.invalid(err);
    }

    // All done.
    return;

  }


};
