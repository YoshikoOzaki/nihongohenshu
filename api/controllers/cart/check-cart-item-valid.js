module.exports = {

  friendlyName: 'Check rental cart item',


  description: 'Check if a rental item is valid to be placed in the cart.',


  extendedDescription:
  `Check if an item is valid for the cart, if so return the item to the front end with up to date data`,

  inputs: {

    Id:  {
      type: 'number',
      required: true,
      example: 1,
      description: 'The id of the item to be checked',
    },

    Quantity: {
      type: 'string',
      required: true,
      description: 'Total count of glasses of this type for the order',
      example: "555"
    },

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

    DaysOfUse: {
      type: 'string',
      required: true,
      description: 'Total number of days the glasses will be used',
      example: "555"
    }
    // should be able to change this to a date range picker with startdate enddate
  },

  exits: {

    dateTaken: {
      responseType: 'badRequest',
      description: 'The provided Date is already taken.',
      extendedDescription: 'Test'
    },

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

    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.
    return exits.success(inputs);
  }

};
