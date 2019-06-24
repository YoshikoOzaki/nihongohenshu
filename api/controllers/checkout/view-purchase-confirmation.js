module.exports = {


  friendlyName: 'View purchase confirmation',


  description: 'Display "Purchase confirmation" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/purchase-confirmation'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
