module.exports = {


  friendlyName: 'Get wash and polish cost',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Wash and polish cost',
    },

  },


  fn: async function (inputs) {

    // Get wash and polish cost.
    var washAndPolishCost;
    // TODO

    washAndPolishCost = 32;

    // Send back the result through the success exit.
    return washAndPolishCost;

  }


};
