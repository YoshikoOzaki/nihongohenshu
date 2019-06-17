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
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    try {
      var recordWithItems = await Order.findOne(
        {
          id: inputs.id,
        }
      ).populate('OrderLineNumbers').populate('User');

      const recordWithNonGlassItemsRemoved = {
        ...recordWithItems,
        OrderLineNumbers: _.filter(recordWithItems.OrderLineNumbers, (o) => {
          return o.Glass !== null;
        }),
      };

      await asyncForEach(recordWithNonGlassItemsRemoved.OrderLineNumbers, async (item, i) => {
        glassDetailsForItem = await Glass.find({ id: item.Glass });

        recordWithNonGlassItemsRemoved.OrderLineNumbers[i].glassDetails = glassDetailsForItem[0];
      });

      async function getTotalOrderPrice() {
        const costs = [];
        const washCost = await WashAndPolish.findOne({ Name: "Wash And Polish"  });
        await asyncForEach(recordWithNonGlassItemsRemoved.OrderLineNumbers, async (item, i) => {
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
        ...recordWithNonGlassItemsRemoved,
        TotalPrice,
      };

      return exits.success(recordWithItemsPropogatedAndTotalPrice);
    } catch (err) {
      return exits.invalid(err);
    }
  }

};
