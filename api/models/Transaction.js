/**
 * Transaction.js
 *
 * Descriptions of all the transactions going through the system and their status.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    OrderNumber: {
      collection: 'Order',
      via: 'OrderTransactions',
    },

    LineNumber: {
      collection: 'OrderLineNumber',
      via: 'Transaction',
    },

    TransactionType: {
      model: 'TransactionType',
      required: true,
    },

    Product: {
      model: 'Glass',
    },

    Quantity: {
      type: 'string',
      description: 'Amount of product in the order',
      example: '450',
      required: true,
    },

    UnitPrice: {
      type: 'string',
      description: 'Time when the transaction will / did take place',
      example: '100',
    },

    Warehouse: {
      type: 'string',
      description: 'Will later reference a warehouse table',
      example: '60'
    },

    Comment: {
      type: 'string',
      description: 'Product owner description of string',
      example: 'Customer requested return one day later',
    },

    Date: {
      // type: 'ref',
      // columnType: 'datetime',
      type: 'ref',
      columnType: 'timestamp',
      description: 'Date the transaction has/will happen(ed)',
      // example: '2018-08-08',
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