module.exports = {


  friendlyName: 'Get Order',


  description: 'Get order',


  extendedDescription:
  `Returns specific order`,

  inputs: {
    id: {
      description: 'The order id',
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
    var newRecord = await Order.findOne(
      {
        id: inputs.id,
      }
    ).populate('OrderLineNumbers');

    // add in the deeper propogated glass details
    const recordWithItemsPropgated = {
      ...newRecord,
    }
    console.log(recordWithItemsPropgated);

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    await asyncForEach(newRecord.OrderLineNumbers, async (item, i) => {
      glassDetailsForItem = await Glass.findOne(item.Glass);
      recordWithItemsPropgated.OrderLineNumbers[i].glassDetails = glassDetailsForItem;
    });
    // add in the deeper propogated glass details

    // Since everything went ok, send our 200 response.
    return exits.success(recordWithItemsPropgated);
  }

};
