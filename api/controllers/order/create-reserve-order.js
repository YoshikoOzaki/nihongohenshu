module.exports = {


  friendlyName: 'Create Reserve Order',


  description: 'Create an order for reserved items.',


  extendedDescription:
  `Adds an order to the database with a reserved status`,

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

    CustomerKeyword: {
      type: 'string',
      required: true,
      description: 'Customer name or customer order keyword'
    },

    Items: {
      type: [{Id: "string", Quantity: "string"}]
    }

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
    console.log(inputs);
    orderInputs = {
      DateStart: inputs.DateStart,
      DateEnd: inputs.DateEnd,
      DaysOfUse: inputs.DaysOfUse,
      CustomerKeyword: inputs.CustomerKeyword,
    }

    var newRecord = await Order.create(orderInputs).fetch();

    let itemResults = [];

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    await asyncForEach(inputs.Items, async (item, i) => {
      const itemInputs = {
        Quantity: item.Quantity,
        Glass: Number(item.Id),
        Order: Number(newRecord.id),
      }

      itemResults[i] = await OrderLineNumber.create(itemInputs)
        .fetch();
    });

    const newRecordAndItems = {
      ...newRecord,
      items: itemResults,
    }
    // after we have the line numers, need to add their ids in a collection to the order

    // localStorage.setItem('storedData', inputs)
    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.
    return exits.success(newRecordAndItems);
  }

};
