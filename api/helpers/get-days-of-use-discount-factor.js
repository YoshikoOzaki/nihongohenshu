module.exports = {


  friendlyName: 'Get days of use discount factor',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Days of use discount factor',
    },

  },


  fn: async function (inputs) {

    // Get days of use discount factor.
    var daysOfUseDiscountFactor;
    // TODO

    daysOfUseDiscountFactor = 1;

    // Send back the result through the success exit.
    return daysOfUseDiscountFactor;

  }


};
