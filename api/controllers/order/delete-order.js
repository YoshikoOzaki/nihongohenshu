module.exports = {


  friendlyName: 'Delete order',


  description: '',


  inputs: {
    OrderId: {
      type: 'number',
      required: true,
      description: 'The order number to be deleted',
      example: 1,
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
      const destroyedRecord = await Order.destroyOne({id: inputs.OrderId});
      return exits.success(destroyedRecord);
    } catch (err) {
      return exits.invalid(err);
    }
    // All done.
    return;

  }


};
