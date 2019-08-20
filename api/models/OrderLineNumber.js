/**
 * OrderLineNumber.js
 *
 * The lines in an order, ie a type of glass with it's quantity.
 */

module.exports = {
  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝

    Quantity: {
      type: 'number',
    },

    UnitPrice: {
      type: 'number',
      description: 'The price of the item when the order was made - '
      + 'non compulsary as some order lines do other things',
    },

    WashAndPolish: {
      type: 'number',
      description: 'The price of the wash and polish when the order was made - '
      + 'non compulsary as some order lines do other things',
    },

    QuantityDiscountFactor: {
      type: 'number',
      description: 'The more items entered the bigger the discount, comes from api calculation',
    },

    TotalPriceRaw: {
      type: 'number',
      description: 'The more items entered the bigger the discount, comes from api calculation',
    },

    TotalPriceWithDiscountsAndWash: {
      type: 'number',
      description: 'The price of the item when the order was made - '
        + 'non compulsary as some order lines do other things',
    },

    TotalWashingCost: {
      type: 'number',
      description: 'The price of the item when the order was made - '
        + 'non compulsary as some order lines do other things',
    },

    Product: {
      model: 'Product',
    },

    Order: {
      model: 'Order',
    },

    Transaction: {
      collection: 'Transaction',
      via: 'LineNumber',
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