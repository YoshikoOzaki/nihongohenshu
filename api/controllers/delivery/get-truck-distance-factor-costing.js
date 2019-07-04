module.exports = {


  friendlyName: 'Get truck distance factor costing',


  description: '',


  inputs: {
    TruckDistanceFactor: {
      description: 'distance factor to query',
      example: '1',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    var response = await TruckDistanceFactorCosting.findOne({TruckDistanceFactor});

    // All done.
    return exits.success(response);

  }


};
