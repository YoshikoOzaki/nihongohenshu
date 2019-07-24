module.exports = {


  friendlyName: 'Validate days of use',


  description: '',


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
      description: 'All done.',
    },

    invalid: {
      description: 'Inputs are not valid',
    },
  },


  fn: async function (inputs, exits) {
    var moment = require("moment");
    var a = moment(inputs.DateEnd);
    var b = moment(inputs.DateStart);

    if (a.isBefore(b)) {
      return exits.invalid('End date is before Start date');
    }

    var daysSelected = a.diff(b, 'days');
    if (daysSelected < Number(inputs.DaysOfUse)) {
      return exits.invalid('Days used is larger than the span of dates selected');
    }

    return exits.success();
  }


};
