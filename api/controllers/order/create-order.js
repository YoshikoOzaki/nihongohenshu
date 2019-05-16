module.exports = {


  friendlyName: 'Create Order',


  description: 'Create an order.',


  extendedDescription:
  `Adds an order to the database`,

  inputs: {

    DateStart: {
      type: 'string',
      required: true,
      description: 'The date start that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      type: 'string',
      required: true,
      description: 'The date end that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DaysOfUse: {
      type: 'string',
      required: true,
      description: 'Total number of days the glasses will be used',
      example: "555"
    },

    CustomerName: {
      type: 'string',
      required: true,
      description: 'Customer name or customer order keyword'
    },

    Items: {
      type: [{Id: "string", Quantity: "string"}]
    },

    ReserveOnly: {
      type: 'boolean',
      description: 'Is this a reserved order',
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
    // var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    orderInputs = {
      DateStart: inputs.DateStart,
      DateEnd: inputs.DateEnd,
      DaysOfUse: inputs.DaysOfUse,
      CustomerName: inputs.CustomerName,
      ReserveOnly: inputs.ReserveOnly,
    }

    var newRecord = await Order.create(orderInputs).fetch();

    let itemResults = [];

    _.forEach(inputs.Items, async (item, i) => {
      const itemInputs = {
        Quantity: item.Quantity,
        Glass: Number(item.Id),
        Order: Number(newRecord.id),
      }

      itemResults[i] = await OrderLineNumber.create(itemInputs).fetch();
    });

    // after we have the line numers, need to add their ids in a collection to the order

    // localStorage.setItem('storedData', inputs)
    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.
    return exits.success(newRecord);
  }

};
