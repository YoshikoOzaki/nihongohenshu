module.exports = {


  friendlyName: 'View rent selection page',


  description: 'Display the rental "selection" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/rent/selection',
      description: 'Display the rental selection for authenticated users.'
    },

  },


  fn: async function (inputs, exits) {

    return exits.success();

  }


};
