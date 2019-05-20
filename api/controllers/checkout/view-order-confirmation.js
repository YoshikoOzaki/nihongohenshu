module.exports = {


  friendlyName: 'View order confirmation',


  description: 'Display "Order confirmation" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/order-confirmation'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
