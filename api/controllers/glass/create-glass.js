module.exports = {


  friendlyName: 'Create Glass',


  description: 'Create a Glass type to be used in the system.',


  extendedDescription:
`Adds a glass type to the database`,

  inputs: {

    Name:  {
      required: true,
      type: 'string',
      example: 'Plumm Glass Flute (Handmade)',
      description: 'The glass\'es full name.',
    },

    TotalQuantityInSystem: {
      type: 'number',
      required: true,
      description: 'Total count of glasses of this type in the system',
      example: 555
    },

    ImgSrc: {
      type: 'string',
      required: true,
      description: 'Glass image src',
      example: 'http://plumm-glasses.jp/media/catalog/product/cache/5/image/600x450/9df78eab33525d08d6e5fb8d27136e95/f/l/flute-handmade.jpg'
    },

    Sku: {
      type: 'string',
      required: true,
      description: 'Glass sku code',
      example: '167'
    }
  },

  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'The provided Name, TotalQuantityInSystem and/or ImgSrc or Sku are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {

    // var newEmailAddress = inputs.emailAddress.toLowerCase();

    // Build up data for the new user record and save it to the database.
    // (Also use `fetch` to retrieve the new ID so that we can use it below.)
    var newRecord = await Glass.create(Object.assign({
      Name: 'Plumm Glass Flute (Handmade)',
      TotalQuantityInSystem: '555',
      ImgSrc: 'http://plumm-glasses.jp/media/catalog/product/cache/5/image/600x450/9df78eab33525d08d6e5fb8d27136e95/f/l/flute-handmade.jpg',
      Sku: '167'
    },{}))
    .intercept({name: 'UsageError'}, 'invalid')
    .fetch();

    // Since everything went ok, send our 200 response.
    return exits.success();

  }

};
