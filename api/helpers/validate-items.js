module.exports = {


  friendlyName: 'Validate items',


  description: '',


  inputs: {
    DateStart: {
      required: true,
      type: 'string',
      description: 'The date start that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      required: true,
      type: 'string',
      description: 'The date end that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DaysOfUse: {
      required: true,
      type: 'string',
      description: 'Total number of days the glasses will be used',
      example: "555"
    },

    Items: {
      type: [{}],
      required: true,
      description: 'All the items in the cart',
    },

    QuantityDiscountFactorForFullRacks: {
      required: true,
      type: {
        discountFactor: 'number',
        totalRequiredFullRacks: 'number',
      },
    },

    OrderIdToIgnore: {
      type: 'number',
      description: 'If we are adding a recovered order, we dont want to calculate transactions from that order',
      example: 12,
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

    invalid: {
      description: 'Inputs are not valid',
    },

  },


  fn: async function (inputs, exits) {
    // utility looping function
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const getAvailability = async function (item) {
      if (!inputs.DateEnd || !inputs.DateStart) {
        return 'No date set to evaluate';
      }
      if (inputs.DateEnd === '0' || inputs.DateStart === '0') {
        return 'No date set to evaluate';
      }
      const getTransactionNumbersToIgnore = async function() {
        if (inputs.OrderIdToIgnore) {
          try {
            const order = await Order.findOne(
              { id: inputs.OrderIdToIgnore }
            ).populate('OrderTransactions');
            const transactionIds = _.map(_.filter(order.OrderTransactions, { 'Product': Number(inputs.Id) }), 'id');
            return transactionIds;
          } catch (err) {
            return exits.invalid('Could not get reserved order details');
          }
        }
        return [];
      }

      const transactionNumbersToIgnore = await getTransactionNumbersToIgnore();
      const transactionTypes = await TransactionType.find();
      const transactionTypesByRecordingHandlingGuide = _.groupBy(transactionTypes, 'RecordHandlingGuide');
      const transactionsInArray = _.map(transactionTypesByRecordingHandlingGuide.In, 'id');
      const transactionsInObject = await Transaction.find({
        where: {
          Product: item.id,
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
          Product: item.id,
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
          Product: item.id,
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
          Product: item.id,
          TransactionType: transactionsReturnedArray,
          id: { '!=': transactionNumbersToIgnore},
          Date: { "<=": inputs.DateStart },
        },
        select: ['Quantity'],
      });
      const transactionsReturned = _.sum(transactionsReturnedObject, (o) => { return o.Quantity });

      const totalAvailableForOrder = transactionsIn - transactionsOut - transactionsAway + transactionsReturned;

      const inventory = totalAvailableForOrder;
      const remaining = totalAvailableForOrder - item.Quantity;

      const availability = {
        available: remaining >= 0 ? 'Available' : 'Not Available',
        remaining: inventory >= 0 ? inventory : 0,
        totalAvailable: inventory,
      };

      return availability;
    }

    const validateItem = async function(item) {
      // const availability = await getAvailability(item);

      // find price of items
      var product;
      try {
        product = await Product.findOne({ id: item.id });
      } catch (err) {
        return exits.invalid('Could not find product');
      }

      if (item.available === 'Not Available') {
        return {
          ...product,
          ...item,
          Quantity: item.Quantity,
          ImgSrc: product.ImgSrc,
          WashAndPolish: 0,
          TotalPriceRaw: 0,
          TotalPriceWithDiscountsAndWash: 0,
          TotalWashingCost: 0,
          DiscountedUnitCostWithDaysFactorForDisplay:0,
          QuantityDiscountFactor: 0,
          // Available: availability,
          Extras: {
            discountedUnitPrice: 0,
            discountedUnitPriceWithDaysOfUseIncreaseFactor: 0,
            totalDiscountedUnitCostWithEverything: 0,
            totalWashingCost: 0,
            daysOfUseIncreaseFactor: 0,
          }
        }
      }


      // Collect variables
      const { DaysOfUse } = inputs;
      const { RackCapacity, UnitPrice } = product;
      const { Quantity } = item;

      const washAndPolishConstant = await sails.helpers.getWashAndPolishCost();
      const daysOfUseIncreaseFactor = await sails.helpers.getDaysOfUseIncreaseFactor(DaysOfUse);

      const UnitPriceWithoutWashing = UnitPrice - washAndPolishConstant;
      const fullRacks = Quantity / RackCapacity;
      const fullRacksRoundedDown = Math.floor(fullRacks);
      const quantityInFullRacks = RackCapacity * fullRacksRoundedDown;
      const quantityInPartiallyFullRack = Number(Quantity) - quantityInFullRacks;
      const partiallyFullRacks = quantityInPartiallyFullRack > 0 ? 1 : 0;

      const quantityFactorForFullRack = inputs.QuantityDiscountFactorForFullRacks.discountFactor;
      // this is coming from the QDFFR calculation

      const quantityFactorForPartialRack = quantityFactorForFullRack;

      // Create Prices
      // ------

      const totalPrice = Number(Quantity) * UnitPriceWithoutWashing;

      // seperate the full and non full racks because
      // they might have different quantity discount factors
      async function getDiscountedBasicTotalWithDiscounts (
        UnitPriceWithoutWashing,
        quantityFactorForFullRack,
        quantityInFullRacks,
        quantityFactorForPartialRack,
        quantityInPartiallyFullRack,
      ) {
        const discountPriceOfFullRacks = (
          UnitPriceWithoutWashing *
          quantityFactorForFullRack *
          quantityInFullRacks
        );
        const discountedPriceOfPartialRacks = (
          UnitPriceWithoutWashing *
          quantityFactorForPartialRack *
          quantityInPartiallyFullRack
        );
        return _.sum([discountPriceOfFullRacks, discountedPriceOfPartialRacks]);
      }

      const discountedBasicTotal = await getDiscountedBasicTotalWithDiscounts(
        UnitPriceWithoutWashing,
        quantityFactorForFullRack,
        quantityInFullRacks,
        quantityFactorForPartialRack,
        quantityInPartiallyFullRack,
      );

      const discountedUnitPrice = discountedBasicTotal / Quantity;
      const discountedUnitPriceWithDaysOfUseIncreaseFactor = discountedUnitPrice * daysOfUseIncreaseFactor;
      const roundedDiscountedUnitPriceWithDaysOfUseIncreaseFactor = Math.round(discountedUnitPriceWithDaysOfUseIncreaseFactor);
      const totalDiscountedUnitCostWithEverything = roundedDiscountedUnitPriceWithDaysOfUseIncreaseFactor * Quantity;

      const totalWashingCost = Quantity * washAndPolishConstant;

      const discountedTotalWithWashAndDaysOfUse = _.sum([totalWashingCost, totalDiscountedUnitCostWithEverything]);

      discountedInputs = {
        ...product,
        ...item,
        Quantity: item.Quantity,
        ImgSrc: product.ImgSrc,
        WashAndPolish: washAndPolishConstant,
        TotalPriceRaw: totalPrice,
        TotalPriceWithDiscountsAndWash: Math.round(discountedTotalWithWashAndDaysOfUse),
        TotalWashingCost: totalWashingCost,
        QuantityDiscountFactor: quantityFactorForFullRack,
        // Available: await getAvailability(item),
        Extras: {
          discountedUnitPrice,
          roundedDiscountedUnitPriceWithDaysOfUseIncreaseFactor,
          totalDiscountedUnitCostWithEverything,
          totalWashingCost,
          daysOfUseIncreaseFactor,
        }
      }

      return discountedInputs;
    }

    let calculatedItems = [];
    await asyncForEach(inputs.Items, async (item) => {
      const validItem = await validateItem(item);
      calculatedItems.push(validItem);
    });

    return exits.success(calculatedItems);

  }
};
