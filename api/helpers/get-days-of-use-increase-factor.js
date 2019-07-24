module.exports = {


  friendlyName: 'Get days of use increase factor',


  description: '',


  inputs: {

    DaysOfUse: {
      type: 'number',
      description: 'The days used to be replaced',
      example: 1
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Days of use increase factor',
    },

    invalid: {
      outputFriendlyName: 'Days of use increase factor',
    },

  },


  fn: async function (inputs, exits) {

    // Get days of use increase factor.
    var daysOfUseIncreaseFactor;

    if (inputs.DaysOfUse === undefined) {
      return exits.success(1);
    }

    if (inputs.DaysOfUse > 32) {
      return exits.invalid("Days of use too long");
    }

    try {
      daysOfUseIncreaseFactor = await DaysOfUseIncreaseFactor.findOne({ PeriodUsed: inputs.DaysOfUse });
      return exits.success(daysOfUseIncreaseFactor.CumulativeIncreaseMultiplier);
    } catch (err) {
      return exits.invalid(err);
    }

    // TODO: needs an upper max

    // Send back the result through the success exit.

  }


};
