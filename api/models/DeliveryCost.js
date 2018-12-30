/**
 * DeliveryCost.js
 *
 * A glass that can be purchased or rented.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    LowZip: {
      type: 'number',
      required: true,
      description: 'Lower range zip code',
      example: 0010010
    },

    HighZip: {
      type: 'number',
      required: true,
      description: 'Higher range zip code',
      example: '0070895'
    },

    Place: {
      type: 'string',
      required: true,
      description: 'Name of region',
      example: 555
    },

    Truck_OK: {
      type: 'number',
      required: true,
      description: 'Can a truck be used',
      example: 0
    },

    Truck_Distance_Factor: {
      type: 'number',
      description: 'Glass sku code',
      example: 156,
    },

    Takuhai_Factor: {
      type: 'number',
      required: false,
      description: '',
      example: 4
    },

    OFFSET: {
      type: 'number',
      required: true,
      description: '',
      example: 36
    },

    ZIP_VALUE: {
      type: 'number',
      required: true,
      description: '',
      example: 1000511
    },

    OFFSET_CALC: {
      type: 'number',
      required: true,
      description: '',
      example: 1000511
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