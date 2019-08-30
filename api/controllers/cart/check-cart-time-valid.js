module.exports = {

  friendlyName: 'Check rental cart time',


  description: 'Check if a rental time period is valid to be applied the cart.',


  extendedDescription:
  `Check if an item is valid for the cart, if so return the time to the front end`,

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

    // DaysOfUse: {
    //   type: 'string',
    //   required: true,
    //   description: 'Total number of days the glasses will be used',
    //   example: "555"
    // }
    // should be able to change this to a date range picker with startdate enddate
  },

  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided Item Id or Dates are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {
    console.log(inputs);
    // add logic to check against other dates already taken and their quantities
    // if (inputs.DateStart === "2018-08-16") {
    //   throw 'dateTaken';
    // }

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

    const DaysOfUse = await sails.helpers.getDaysOfUse(inputs.DateStart, inputs.DateEnd);

    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.

    var response = {
      ...inputs,
      DaysOfUse,
    }

    return exits.success(response);
  }

};
