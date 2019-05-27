/**
 * Order.js
 *
 * An order.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    DateStart: {
      type: 'ref',
      required: true,
      columnType: 'timestamp',
      description: 'The date start that needs to be checked',
      // example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      type: 'ref',
      required: true,
      columnType: 'timestamp',
      description: 'The date end that needs to be checked',
      // example: '2018-08-08T14:00:00.000Z'
    },

    DaysOfUse: {
      type: 'string',
      required: true,
      description: 'Total number of days the glasses will be used',
      example: "555"
    },

    CustomerKeyword: {
      type: 'string',
      description: 'If customer is a guest it will need a keyword for identification',
      example: 'wineorder1234'
    },

    Reserved: {
      type: 'boolean',
      description: 'Is this a reserved order',
      example: true,
      defaultsTo: false,
    },

    Postcode: {
      type: 'number',
      description: 'Added for reserving orders',
      example: 600000,
    },

    User: {
      model: 'User',
      description: 'Links order to a user, not required as some orders are for guests'
    },

    OrderLineNumbers: {
      collection: 'OrderLineNumber',
      via: 'Order',
    },

    OrderTransactions: {
      collection: 'Transaction',
      via: 'OrderNumber'
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