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

      let transactionsInObject;
      try {
        transactionsInObject = await Transaction.find({
          where: {
            Product: item.id,
            TransactionType: transactionsInArray,
            id: { '!=': transactionNumbersToIgnore},
            Date: { "<=": inputs.DateStart },
          },
          select: ['Quantity'],
        });
      } catch (err) {
        console.log(err);
        return exits.invalid(err);
      }
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
      // find price of items
      var product;
      try {
        product =  await Product.findOne({ id: item.id });
      } catch (err) {
        return exits.invalid('Could not find product ' + item.id);
      }

      discountedInputs = {
        ...product,
        Quantity: item.Quantity,
        Available: await getAvailability(item),
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
