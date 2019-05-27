module.exports = {

  friendlyName: 'Check rental cart item',


  description: 'Check if a rental item is valid to be placed in the cart.',


  extendedDescription:
  `Check if an item is valid for the cart, if so return the item to the front end with up to date data`,

  inputs: {

    Id:  {
      type: 'string',
      required: true,
      example: '1',
      description: 'The id of the item to be checked',
    },

    Quantity: {
      type: 'string',
      required: true,
      description: 'Total count of glasses of this type for the order',
      example: "555"
    },

    DateStart: {
      type: 'string',
      description: 'The date start that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      type: 'string',
      description: 'The date end that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DaysOfUse: {
      type: 'string',
      description: 'Total number of days the glasses will be used',
      example: "555"
    },

    OrderIdToIgnore: {
      type: 'number',
      description: 'If we are adding a recovered order, we dont want to calculate transactions from that order',
      example: 12,
    },

    // should be able to change this to a date range picker with startdate enddate
  },

  exits: {

    dateTaken: {
      responseType: 'badRequest',
      description: 'The provided Date is already taken.',
      extendedDescription: 'Test'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided Item Id or Dates are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {
    // check availability and add available to each item that is checked
    async function getAvailability () {
      if (!inputs.DateEnd || !inputs.DateStart) {
        return 'No date set to evaluate';
      }

      // const OrderIdToIgnore = inputs.OrderIdToIgnore === undefined ? 0 : inputs.OrderIdToIgnore;
      const getTransactionNumbersToIgnore = async function() {
        if (inputs.OrderIdToIgnore) {
          const order = await Order.findOne(
            { id: inputs.OrderIdToIgnore }
          ).populate('OrderTransactions');
          const transactionIds = _.map(_.filter(order.OrderTransactions, { 'Product': Number(inputs.Id) }), 'id');
          return transactionIds;
        }
        return [];
      }
      // TODO: pass in the *order number* in inputs, get the transaction numbers from that, exclude those transaction numbers in the below query
      // will need to add every possible code
      // unless we use the transaction process type values well
      const transactionNumbersToIgnore = await getTransactionNumbersToIgnore();
      [
        stockIn,
        orderOut,
        returnPlanned,
        orderReturned,
        returnAndWashCompleted,
      ] = await Promise.all([
        await Transaction.find({
          where: {
            Product: inputs.Id,
            Date: { '<=': inputs.DateStart },
            TransactionType: 10,
            id: { '!=': transactionNumbersToIgnore}
          },
          select: ['Quantity'],
        }),
        await Transaction.find({
          where: {
            Product: inputs.Id,
            Date: { '<=': inputs.DateEnd },
            TransactionType: 40,
            id: { '!=': transactionNumbersToIgnore}
          },
          select: ['Quantity'],
        }),
        await Transaction.find({
          where: {
            Product: inputs.Id,
            Date: { '<=': inputs.DateEnd },
            TransactionType: 44,
            id: { '!=': transactionNumbersToIgnore}
          },
          select: ['Quantity'],
        }),
        await Transaction.find({
          where: {
            Product: inputs.Id,
            Date: { '<=': inputs.DateEnd },
            TransactionType: 55,
            id: { '!=': transactionNumbersToIgnore}
          },
          select: ['Quantity'],
        }),
        await Transaction.find({
          where: {
            Product: inputs.Id,
            Date: { '<=': inputs.DateEnd },
            TransactionType: 57,
            id: { '!=': transactionNumbersToIgnore}
          },
          select: ['Quantity'],
        })
      ]);

      // collect totals related to those dates
      const stockInTotal = _.sum(stockIn, (o) => { return o.Quantity });
      const orderOutTotal = _.sum(orderOut, (o) => { return o.Quantity });
      const returnPlanedTotal = _.sum(returnPlanned, (o) => { return o.Quantity });
      const orderReturnedTotal = _.sum(orderReturned, (o) => { return o.Quantity });
      const returnAndWashedTotal = _.sum(returnAndWashCompleted, (o) => { return o.Quantity });

      // calculate available or not
      const totalAvailableForOrder =
      stockInTotal -
      orderOutTotal +
      returnPlanedTotal +
      orderReturnedTotal +
      returnAndWashedTotal;

      const availability = {
        available: totalAvailableForOrder - inputs.Quantity > 0 ? 'Available' : 'Not Available',
        remaining: totalAvailableForOrder,
      };

      return availability;
    };

    // find price of items
    var item =  await Glass.findOne({ id: inputs.Id });
    // get the days of use from the cart value

    // Collect variables
    const { Quantity } = inputs;
    const { RackCapacity, UnitPrice } = item;
    const washAndPolishConstant = 32;
    const daysOfUseDiscountFactor = 1;

    const basePrice = UnitPrice;
    const fullRacks = Quantity / RackCapacity;
    const fullRacksRoundedDown = Math.floor(fullRacks);
    const quantityInFullRacks = RackCapacity * fullRacksRoundedDown;
    const quantityInPartiallyFullRack = Quantity - quantityInFullRacks;

    const quantityFactorForFullRack = 0.9;
    const quantityFactorForPartialRack = 0.9;

    // Create Prices
    // ------

    const totalPrice = Quantity * UnitPrice;

    // Remove washing cost, calculate for full and partial racks the discount as a lump sum
    // const DiscountedBasePrice =
    //   ((
    //     basePrice *
    //     daysOfUseDiscountFactor *
    //     quantityFactorForFullRack *
    //     quantityInFullRacks
    //   )
    //   +
    //   (
    //     basePrice *
    //     daysOfUseDiscountFactor *
    //     quantityFactorForPartialRack *
    //     quantityInPartiallyFullRack
    //   ));

    async function getDiscountedBasePrice (
      basePrice,
      daysOfUseDiscountFactor,
      quantityFactorForFullRack,
      quantityInFullRacks,
      quantityFactorForPartialRack,
      quantityInPartiallyFullRack,
    ) {
      return (
        basePrice *
        daysOfUseDiscountFactor *
        quantityFactorForFullRack *
        quantityInFullRacks
      )
      +
      (
        basePrice *
        daysOfUseDiscountFactor *
        quantityFactorForPartialRack *
        quantityInPartiallyFullRack
      );
    }

    // Divide it by the total quantity and add was cost back on to get discounted unit price
    discountedBasePrice = await getDiscountedBasePrice(
      basePrice,
      daysOfUseDiscountFactor,
      quantityFactorForFullRack,
      quantityInFullRacks,
      quantityFactorForPartialRack,
      quantityInPartiallyFullRack,
    );

    console.log(
      basePrice,
      daysOfUseDiscountFactor,
      quantityFactorForFullRack,
      quantityInFullRacks,
      quantityFactorForPartialRack,
      quantityInPartiallyFullRack
    );

    const discountedUnitPrice = discountedBasePrice / Quantity;
    const discountedUnitPriceWithWash = discountedUnitPrice + washAndPolishConstant;

    // Use the new discounted unit price to calculate the discounted total cost
    const discountedTotalPrice = discountedUnitPriceWithWash * Quantity;
    const totalPriceWithWash = (basePrice +  washAndPolishConstant) * Quantity;

    discountedInputs = {
      Id: inputs.Id,
      NameEng: item.NameEng,
      Quantity: inputs.Quantity,
      UnitPrice: item.UnitPrice,
      ImgSrc: item.ImgSrc,
      WashAndPolish: washAndPolishConstant,
      TotalPrice: totalPrice,
      TotalPriceWithWash: totalPriceWithWash,
      DiscountedBasePrice: discountedBasePrice,
      DiscountedUnitPrice: discountedUnitPrice,
      DiscountedUnitPriceWithWash: discountedUnitPriceWithWash,
      DiscountedTotalPrice: discountedTotalPrice,
      Available: await getAvailability(),
    }

    return exits.success(discountedInputs);
  }

};
