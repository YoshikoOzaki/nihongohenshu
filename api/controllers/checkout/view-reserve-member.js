module.exports = {


  friendlyName: 'View reserve member',


  description: 'Display "Reserve member" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/reserve-member'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
