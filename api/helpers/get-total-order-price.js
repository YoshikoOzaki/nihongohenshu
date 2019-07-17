module.exports = {


  friendlyName: 'Get total order price',


  description: '',


  inputs: {
    Order: {
      type: {},
      required: true,
      description: 'The order',
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Total order price',
    },

  },


  fn: async function (inputs) {

    // Get total order price.
    var totalOrderPrice;
    // TODO

    const washCost = await WashAndPolish.findOne({ Name: "Wash And Polish"  });
    const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
    await asyncForEach(Order.OrderLineNumbers, async (item, i) => {
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
    // Send back the result through the success exit.
    return totalOrderPrice;

  }


};
