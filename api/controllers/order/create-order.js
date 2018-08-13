module.exports = {


  friendlyName: 'Create Order',


  description: 'Create an order.',


  extendedDescription:
  `Adds an order to the database`,

  inputs: {

    GlassType:  {
      type: 'string',
      required: true,
      example: 'Plumm Glass Flute (Handmade)',
      description: 'The glass\'es full name.',
    },

    Quantity: {
      type: 'number',
      required: true,
      description: 'Total count of glasses of this type for the order',
      example: 555
    },

    Date: {
      type: 'string',
      required: true,
      description: 'Date for order',
      example: '2018-08-08T14:00:00.000Z'
    },
    // should be able to change this to a date range picker with startdate enddate
  },

  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided Name, TotalQuantityInSystem and/or date are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {
    // var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newRecord = await Order.create(inputs).fetch();
    // localStorage.setItem('storedData', inputs)

    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.
    return exits.success();
  }

};
