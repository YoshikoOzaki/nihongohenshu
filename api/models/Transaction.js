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

    // change this to relationship with the other table
    TransactionType: {
      type: 'string',
      description: 'Relationship to the type of transaction',
      example: '40'
    },

    Product: {
      model: 'Glass',
    },

    Quantity: {
      type: 'string',
      description: 'Amount of product in the order',
      example: '450'
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
      type: 'string',
      description: 'Time the order was made',
      example: '2018-08-08T14:00:00.000Z',
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