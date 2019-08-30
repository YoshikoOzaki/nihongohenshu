module.exports = {


  friendlyName: 'View reserve guest',


  description: 'Display "Reserve guest" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/reserve-guest'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
