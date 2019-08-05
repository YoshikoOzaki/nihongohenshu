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

    GuestName: {
      type: 'string',
      description: 'If customer is a guest it will need a keyword for identification',
      example: 'Jarod Crowe'
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
    },

    AddressLine1: {
      type: 'string',
    },

    AddressLine2: {
      type: 'string',
    },

    AddressLine3: {
      type: 'string',
    },

    Telephone1: {
      type: 'string',
    },

    Email1: {
      type: 'string',
      isEmail: true,
    },

    Comment: {
      type: 'string',
    },

    Paid: {
      type: 'boolean',
    },

    TakuhaiTimeSlot: {
      model: 'TakuhaiTimeSlot',
      description: 'Links order to a time slot, not required for all orders as some use other delivery methods'
    },

    SubTotal : {
      type: 'number',
      description: 'The total before tax'
    },
    
    TaxTotal : {
      type: 'number',
      description: 'The total tax'
    },

    GrandTotal : {
      type: 'number',
      description: 'The total after tax'
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