module.exports = {

  friendlyName: 'Process order charge',


  description: 'Charge user via stripe',


  extendedDescription:
  `Send valid user token to stripe and charge their card / payment method`,

  inputs: {
    Currency: {
      type: 'string',
      required: true,
    },

    Description: {
      type: 'string',
      required: true,
    },

    Amount: {
      type: 'number',
      required: true,
    },

    Token: {
      type: 'number',
      required: true,
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
    var stripe = require("stripe")("sk_test_0SBa3PFd8pOm7g6K22pkANfw");

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = request.body.stripeToken; // Using Express

    (async () => {
      const charge = await stripe.charges.create({
        amount: inputs.Amount,
        currency: inputs.Currency,
        description: inputs.Description,
        source: token,
      });
    })();

    var newRecord = await Order.create(orderInputs).fetch();

    let itemResults = [];

    _.forEach(inputs.Items, async (item, i) => {
      const itemInputs = {
        Quantity: item.Quantity,
        Glass: Number(item.Id),
        Order: Number(newRecord.id),
      }
      console.log(itemInputs);

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
