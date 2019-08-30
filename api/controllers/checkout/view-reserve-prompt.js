module.exports = {


  friendlyName: 'View reserve prompt',


  description: 'Display "Reserve prompt" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/checkout/reserve-prompt'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
