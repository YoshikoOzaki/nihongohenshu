module.exports = {


  friendlyName: 'Recover reserved order',


  description: 'Get a given reserved order based on order id and keyword',


  inputs: {
    id: {
      description: 'The order id',
      example: '1',
      required: true
    },
    keyword: {
      description: 'The reserved order keyword',
      example: '1',
      required: true
    }
  },

  exits: {
    invalid: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: ''
    },
    invalid: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: ''
    },
  },


  fn: async function (inputs, exits) {
    try {
    var recoveredOrder = await Order.findOne(
      {
        id: inputs.id,
        CustomerKeyword: inputs.keyword,
      }
    )
    .populate('OrderLineNumbers')
    .populate('OrderTransactions');
    if (recoveredOrder) {
      return exits.success(recoveredOrder);
    }
    return exits.noOrder('no order found');
    } catch (err) {
      return exits.invalid(err);
    }

    return;
  }


};
