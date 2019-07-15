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

    duplicateItem: {
      responseType: 'badRequest',
      description: 'This item is already in the cart',
      extendedDescription: 'This item is already in the cart, please update the' +
      ' cart quantitiy rather than adding the same item again'
    },

  },


  fn: async function (inputs, exits) {
    // check availability and add available to each item that is checked
    // const result = _.findIndex(inputs.Cart.items, { 'id': Number(inputs.Id) });
    // console.log(result);
    // if (_.findIndex(inputs.Cart.items, { 'id': Number(inputs.Id) }) >= 0) {
    //   return exits.duplicateItem('This item is already in the cart, please update the' +
    //   ' cart quantitiy rather than adding the same item again');
    // }

    async function getAvailability () {
      if (!inputs.DateEnd || !inputs.DateStart) {
        return 'No date set to evaluate';
      }

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

      const transactionNumbersToIgnore = await getTransactionNumbersToIgnore();
      const transactionTypes = await TransactionType.find();
      const transactionTypesByRecordingHandlingGuide = _.groupBy(transactionTypes, 'RecordHandlingGuide');

      const transactionsInArray = _.map(transactionTypesByRecordingHandlingGuide.In, 'id');
      const transactionsInObject = await Transaction.find({
        where: {
          Product: inputs.Id,
          TransactionType: transactionsInArray,
          id: { '!=': transactionNumbersToIgnore},
          Date: { "<=": inputs.DateStart },
        },
        select: ['Quantity'],
      });
      const transactionsIn = _.sum(transactionsInObject, (o) => { return o.Quantity });

      const transactionsOutArray = _.map(transactionTypesByRecordingHandlingGuide.Out, 'id');
      const transactionsOutObject = await Transaction.find({
        where: {
          Product: inputs.Id,
          TransactionType: transactionsOutArray,
          id: { '!=': transactionNumbersToIgnore},
          Date: { "<=": inputs.DateEnd },
        },
        select: ['Quantity'],
      });
      const transactionsOut = _.sum(transactionsOutObject, (o) => { return o.Quantity });

      const transactionsAwayArray = _.map(transactionTypesByRecordingHandlingGuide.Away, 'id');
      const transactionsAwayObject = await Transaction.find({
        where: {
          Product: inputs.Id,
          TransactionType: transactionsAwayArray,
          id: { '!=': transactionNumbersToIgnore},
          Date: { "<=": inputs.DateEnd },
        },
        select: ['Quantity'],
      });
      const transactionsAway = _.sum(transactionsAwayObject, (o) => { return o.Quantity });

      const transactionsReturnedArray = _.map(transactionTypesByRecordingHandlingGuide.Returned, 'id');
      const transactionsReturnedObject = await Transaction.find({
        where: {
          Product: inputs.Id,
          TransactionType: transactionsReturnedArray,
          id: { '!=': transactionNumbersToIgnore},
          Date: { "<=": inputs.DateStart },
        },
        select: ['Quantity'],
      });
      const transactionsReturned = _.sum(transactionsReturnedObject, (o) => { return o.Quantity });

      const totalAvailableForOrder = transactionsIn - transactionsOut - transactionsAway + transactionsReturned;

      const inventory = totalAvailableForOrder;
      const remaining = totalAvailableForOrder - inputs.Quantity;

      const availability = {
        available: remaining >= 0 ? 'Available' : 'Not Available',
        remaining: inventory >= 0 ? inventory : 0,
        totalAvailable: inventory,
      };

      return availability;
    }

    // find price of items
    var item =  await Product.findOne({ id: inputs.Id });
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
    const partiallyFullRacks = quantityInPartiallyFullRack > 0 ? 1 : 0;

    // const quantityFactorForFullRack = 0.46+0.551/1.04^(_.max([0, fullRacksRoundedDown -3]));
    const racksToThePowerOf = _.max([0, fullRacksRoundedDown + partiallyFullRacks -3]);
    // const quantityFactorForFullRack = Math.pow(0.46 + ( 0.551 / 1.04 ), racksToThePowerOf);
    const quantityFactorForFullRackRaw = 0.46 + 0.551 / Math.pow(1.04, racksToThePowerOf);
    const quantityFactorForFullRack = quantityFactorForFullRackRaw > 1 ? 1 : quantityFactorForFullRackRaw;
    // const quantityFactorForFullRack = Math.pow((racksToThePowerOf), 0.46 + ( 0.551 / 1.04 ));

    const quantityFactorForPartialRack = quantityFactorForFullRack;

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
    const discountedBasePrice = await getDiscountedBasePrice(
      basePrice,
      daysOfUseDiscountFactor,
      quantityFactorForFullRack,
      quantityInFullRacks,
      quantityFactorForPartialRack,
      quantityInPartiallyFullRack,
    );

    const discountedUnitPrice = Math.round(discountedBasePrice / Quantity);
    const discountedUnitPriceWithWash = discountedUnitPrice + washAndPolishConstant;

    // Use the new discounted unit price to calculate the discounted total cost
    const discountedTotalPrice = discountedUnitPriceWithWash * Quantity;
    const totalPriceWithWash = (basePrice +  washAndPolishConstant) * Quantity;

    discountedInputs = {
      ...item,
      Quantity: inputs.Quantity,
      ImgSrc: item.ImgSrc,
      WashAndPolish: washAndPolishConstant,
      TotalPrice: totalPrice,
      TotalPriceWithWash: totalPriceWithWash,
      DiscountedBasePrice: discountedBasePrice,
      DiscountedUnitPrice: discountedUnitPrice,
      DiscountedUnitPriceWithWash: discountedUnitPriceWithWash,
      DiscountedTotalPrice: discountedTotalPrice,
      Available: await getAvailability(),
      quantityFactorForFullRack,
    }

    return exits.success(discountedInputs);
  }

};
