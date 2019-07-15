module.exports = {


  friendlyName: 'View purchase member',


  description: 'Display "Purchase member" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/purchase-member'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
