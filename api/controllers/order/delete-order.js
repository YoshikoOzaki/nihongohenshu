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
      const deletedOrderLines = await Transaction.destroy({
        OrderNumber: inputs.OrderId,
      });
      const deletedOrder = await Order.destroyOne({id: inputs.OrderId});
      const result = {
        ...deletedOrderLines,
        ...deletedOrder,
      };
      return exits.success(result);
    } catch (err) {
      return exits.invalid(err);
    }
    // All done.
    return;

  }


};
