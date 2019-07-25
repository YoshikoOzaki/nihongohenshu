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

    const subTotal = ((_.sum(inputs.Items, (o) => { return o.TotalPriceWithDiscountsAndWash }) + inputs.Shipping.price) || 0);
    const taxTotal = Math.round(((_.sum(inputs.Items, (o) => { return o.TotalPriceWithDiscountsAndWash }) + inputs.Shipping.price) || 0) * inputs.TaxRate);
    const grandTotal = _.sum([subTotal, taxTotal]);

    cartTotals = {
      subTotal,
      taxTotal,
      grandTotal,
    }

    // Send back the result through the success exit.
    return exits.success(cartTotals);

  }
};
