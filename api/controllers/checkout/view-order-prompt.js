module.exports = {


  friendlyName: 'View order prompt',


  description: 'Display "Order prompt" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/order-prompt'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
