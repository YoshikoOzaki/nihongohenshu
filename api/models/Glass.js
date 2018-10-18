/**
 * Glass.js
 *
 * A glass that can be purchased or rented.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    Name: {
      type: 'string',
      required: true,
      description: 'Full representation of the glass\'es name',
      maxLength: 120,
      example: 'Plumm Glass Flute (Handmade)'
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
      type: 'number',
      required: true,
      description: 'Glass sku code',
      example: '167'
    },

    UnitPrice: {
      type: 'number',
      required: true,
      description: 'Product rental price',
      example: '120'
    },

    RackCapacity: {
      type: 'number',
      required: true,
      description: 'How many of this item can fit into their rack',
      example: '36'
    },

    OrderLineNumbers: {
      collection: 'OrderLineNumber',
      via: 'Glass',
    }

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    // n/a

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // n/a
  }
}