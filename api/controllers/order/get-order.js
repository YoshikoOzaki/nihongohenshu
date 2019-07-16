module.exports = {


  friendlyName: 'Get Order',


  description: 'Get order',


  extendedDescription:
  `Returns specific order`,

  inputs: {
    Id: {
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
          id: inputs.Id,
        }
      ).populate('OrderLineNumbers').populate('User');

      // const recordWithNonGlassItemsRemoved = {
      //   ...recordWithItems,
      //   OrderLineNumbers: _.filter(recordWithItems.OrderLineNumbers, (o) => {
      //     return o.Product !== 160;
      //   }),
      // };

      await asyncForEach(recordWithItems.OrderLineNumbers, async (item, i) => {
        glassDetailsForItem = await Product.findOne({ id: item.Product });

        recordWithItems.OrderLineNumbers[i].glassDetails = glassDetailsForItem;
      });

      async function getTotalOrderPrice() {
        const costs = [];
        const washCost = await WashAndPolish.findOne({ Name: "Wash And Polish"  });
        const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
        await asyncForEach(recordWithItems.OrderLineNumbers, async (item, i) => {
          if (item.Product !== 160) {
            const itemCost = ((item.UnitPrice + washCost.Price) * item.Quantity);
            const itemCostPlusTax = itemCost + (itemCost * consumptionTaxRate);
            costs.push(itemCostPlusTax);
            return;
          }
          // this should be a delivery or non glass item
          const itemCost = item.UnitPrice * item.Quantity;
          const itemCostPlusTax = itemCost + (itemCost * consumptionTaxRate);
          costs.push(itemCostPlusTax);
        });
        return _.sum(costs);
      }
      const TotalPrice = await getTotalOrderPrice();

      recordWithItemsPropogatedAndTotalPrice = {
        ...recordWithItems,
        TotalPrice,
      };

      return exits.success(recordWithItemsPropogatedAndTotalPrice);
    } catch (err) {
      return exits.invalid(err);
    }
  }

};
