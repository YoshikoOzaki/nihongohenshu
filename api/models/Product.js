/**
 * Product.js
 *
 * A glass that can be purchased or rented.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    NameE: {
      type: 'string',
      required: true,
      description: 'Full representation of the glass\'es name in english',
      maxLength: 120,
      example: 'Plumm Glass Flute (Handmade)'
    },

    NameJ: {
      type: 'string',
      description: 'Full representation of the glass\'es name in japanese',
      maxLength: 120,
      example: 'ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ ﾌﾙｰﾄ'
    },

    ImgSrc: {
      type: 'string',
      description: 'Glass image src',
      example: 'http://plumm-glasses.jp/media/catalog/product/cache/5/image/600x450/9df78eab33525d08d6e5fb8d27136e95/f/l/flute-handmade.jpg'
    },

    // change the sku to be the id... maybe
    // Sku: {
    //   type: 'number',
    //   required: true,
    //   description: 'Glass sku code',
    //   example: '167'
    // },

    UnitPrice: {
      type: 'number',
      required: true,
      description: 'Product rental price',
      example: '120'
    },

    RackCapacity: {
      type: 'number',
      description: 'How many of this item can fit into their rack',
      example: '36'
    },

    RackHeight: {
      type: 'number',
      description: 'in mm',
    },

    OrderLineNumbers: {
      collection: 'OrderLineNumber',
      via: 'Product',
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