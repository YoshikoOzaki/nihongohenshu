module.exports = {


  friendlyName: 'Get cart totals',


  description: '',


  inputs: {

    Shipping: {
      type: {},
      required: true,
      description: 'Validated Shipping',
    },

    Items: {
      type: [{}],
      required: true,
      description: 'Validated Items',
    },

    TaxRate: {
      type: 'number',
      required: true,
      description: 'Validated tax rate',
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Cart totals',
    },

    invalid: {
      description: 'Inputs are not valid',
    },

  },


  fn: async function (inputs, exits) {
    // Get cart totals.
    var cartTotals;

    const shippingPrice = inputs.Shipping.Price || 0;

    const itemsCost = _.sum(inputs.Items, (o) => { return o.TotalPriceWithDiscountsAndWash });

    const subTotal = (_.sum([itemsCost, shippingPrice]));
    const taxTotal = (_.sum([itemsCost, shippingPrice])) * inputs.TaxRate;
    const grandTotal = _.sum([subTotal, taxTotal]);

    cartTotals = {
      shippingTotal: shippingPrice,
      cartItemsTotal: itemsCost,
      subTotal,
      taxTotal,
      grandTotal,
    }

    // Send back the result through the success exit.
    return exits.success(cartTotals);

  }
};
