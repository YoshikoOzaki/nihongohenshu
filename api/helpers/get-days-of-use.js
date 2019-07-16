module.exports = {


  friendlyName: 'Get days of use',


  description: 'Calculate the days of use based on a given start and end date',


  inputs: {

    DateStart: {
      type: 'string',
      required: true,
      description: 'The date start that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      type: 'string',
      required: true,
      description: 'The date end that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

  },


  exits: {

    success: {
      outputFriendlyName: 'Days of use',
    },

  },


  fn: async function (inputs) {

    // Get days of use.
    var daysOfUse;
    // TODO

    var moment = require("moment");
    var a = moment(inputs.DateEnd);
    var b = moment(inputs.DateStart);

    var daysSelectedLength = a.diff(b, 'days');

    daysOfUse = Math.max(1, ( daysSelectedLength - 3 ));


    // Send back the result through the success exit.
    return daysOfUse;

  }


};
