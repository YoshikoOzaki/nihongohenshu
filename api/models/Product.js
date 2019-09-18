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

    NameE1: {
      type: 'string',
      required: true,
      description: 'Full representation of the glass\'es name in english',
      maxLength: 120,
      example: 'Plumm Glass Flute (Handmade)'
    },

    NameE2: {
      type: 'string',
      description: 'Full representation of the glass\'es name in english',
      maxLength: 120,
      example: 'Plumm Glass Flute (Handmade)'
    },

    NameJ1: {
      type: 'string',
      description: 'Full representation of the glass\'es name in japanese',
      maxLength: 120,
      example: 'ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ ﾌﾙｰﾄ'
    },

    NameJ2: {
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

    Type: {
      type: 'string',
      description: 'Glassware Delivery Addon...',
    },

    OrderLineNumbers: {
      collection: 'OrderLineNumber',
      via: 'Product',
    },

    Volume: {
      type: 'number',
      description: '',
      example: '99'
    },

    Height: {
      type: 'number',
      description: '',
      example: '99'
    },

    RimDiameter: {
      type: 'number',
      description: '',
      example: '99'
    },

    MaxBowlDiameter: {
      type: 'number',
      description: '',
      example: '99'
    },

    BaseDiameter: {
      type: 'number',
      description: '',
      example: '99'

    },

    Weight: {
      type: 'number',
      description: '',
      example: '99'
    },

    Description: {
      type: 'string',
      description: '',
      example: 'ワインをカジュアルに楽しむとき、ビール、ソフトドリンクにも'
    },

    WineScaleOptions: {
      collection: 'WineScaleOption',
      via: 'Products',
    },

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