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
    try {
      var newRecord = await Order.findOne(
        {
          id: inputs.id,
        }
      ).populate('OrderLineNumbers');

      const recordWithItemsPropgated = {
        ...newRecord,
      }

      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }
      await asyncForEach(newRecord.OrderLineNumbers, async (item, i) => {
        glassDetailsForItem = await Glass.find({ id: item.Glass });

        recordWithItemsPropgated.OrderLineNumbers[i].glassDetails = glassDetailsForItem[0];
      });

      // this isn't working yet
      async function getTotalOrderPrice() {
        const costs = [];
        const washCost = await WashAndPolish.findOne({ Name: "Wash And Polish"  });
        await asyncForEach(recordWithItemsPropgated.OrderLineNumbers, async (item, i) => {
          if (item.Glass !== null) {
            const itemCost = (item.UnitPrice + washCost.Price) * item.Quantity;
            costs.push(itemCost);
            return;
          }
          // this should be a delivery or non glass item
          const itemCost = item.unitPrice * item.quantity;
          costs.push(itemCost);
        });
        return _.sum(costs);
      }
      const TotalPrice = await getTotalOrderPrice();

      recordWithItemsPropogatedAndTotalPrice = {
        ...recordWithItemsPropgated,
        TotalPrice,
      };

      return exits.success(recordWithItemsPropogatedAndTotalPrice);
    } catch (err) {
      return exits.invalid(err);
    }
  }

};
