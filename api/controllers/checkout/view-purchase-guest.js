module.exports = {


  friendlyName: 'View purchase guest',


  description: 'Display "Purchase guest" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/purchase-guest'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
