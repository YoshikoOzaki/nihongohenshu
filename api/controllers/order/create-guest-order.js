module.exports = {


  friendlyName: 'Create Guest Order',


  description: 'Create an order for guest.',


  extendedDescription:
  `Adds an order to the database with a normal status`,

  inputs: {

    DateStart: {
      type: 'string',
      required: true,
      description: 'The date start that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DateEnd: {
      type: 'string',
      required: true,
      description: 'The date end that needs to be checked',
      example: '2018-08-08T14:00:00.000Z'
    },

    DaysOfUse: {
      type: 'string',
      required: true,
      description: 'Total number of days the glasses will be used',
      example: "555"
    },

    GuestName: {
      type: 'string',
      required: true,
      description: 'Customer name or customer order keyword'
    },

    Items: {
      type: [{
        Id: "number",
        Quantity: "number",
        UnitPrice: "number"
      }]
    },

    Reserved: {
      type: 'boolean',
      description: 'Change order to reserve order',
    },

    DeliveryCost: {
      type: 'number',
      description: 'Cost of the delivery based on postcode',
      required: true,
    },

    Postcode: {
      type: 'number',
      description: 'Postcode assigned to the order for shipping'
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

  },

  exits: {

    invalid: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: ''
    },

  },

  fn: async function (inputs, exits) {
    // utility looping function
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const createOrder = async function() {
      orderInputs = {
        DateStart: inputs.DateStart,
        DateEnd: inputs.DateEnd,
        DaysOfUse: inputs.DaysOfUse,
        GuestName: inputs.GuestName,
        Reserved: inputs.Reserved,
        Postcode: inputs.Postcode,
        AddressLine1: inputs.AddressLine1,
        AddressLine2: inputs.AddressLine2,
        AddressLine3: inputs.AddressLine3,
        Telephone1: inputs.Telephone1,
        Email1: inputs.Email1,
        Comment: inputs.Comment,
      }
      var newRecord = await Order.create(orderInputs).fetch();
      return newRecord;
    };

    const createItemOrderLines = async function(order) {
      let itemResults = [];
      await asyncForEach(inputs.Items, async (item, i) => {
        const itemInputs = {
          Quantity: Number(item.Quantity),
          UnitPrice: Number(item.UnitPrice),
          Glass: Number(item.Id),
          Order: Number(order.id),
        }

        itemResults[i] = await OrderLineNumber.create(itemInputs)
          .fetch();
      });
      return itemResults;
    };

    const createDeliveryOrderLine = async function(order) {
      const payload = {
        Quantity: 1,
        UnitPrice: inputs.DeliveryCost,
        Order: Number(order.id),
      }
      let delivery = await OrderLineNumber.create(payload).fetch();
      return delivery;
    };

    const createReserveOrderTransactionLines = async function(orderLines, order, delivery) {
      let transactionLines = [];
      await asyncForEach(orderLines, async (orderLine, i) => {
        const reserveFromPayload = {
          OrderNumber: order.id,
          LineNumber: orderLine.id,
          TransactionType: 40, // rental order
          Product: orderLine.Glass,
          Quantity: orderLine.Quantity,
          UnitPrice: orderLine.UnitPrice,
          Warehouse: 60,
          Comment: 'Created from web api',
          Date: order.DateStart,
        }
        const returnPlannedOnPayload = {
          OrderNumber: order.id,
          LineNumber: orderLine.id,
          TransactionType: 44, // return planned
          Product: orderLine.Glass,
          Quantity: orderLine.Quantity,
          UnitPrice: orderLine.UnitPrice,
          Warehouse: 60,
          Comment: 'Created from web api',
          Date: order.DateEnd,
        }
        transactionLines[i] = {};
        transactionLines[i] = {
          reservedFrom: await Transaction.create(reserveFromPayload).fetch(),
          returnOn: await Transaction.create(returnPlannedOnPayload).fetch(),
        }
      });
      const deliveryPurchasePayload = {
        OrderNumber: order.id,
        LineNumber: delivery.id,
        TransactionType: 60, // delivery cost
        Quantity: delivery.Quantity,
        UnitPrice: delivery.UnitPrice,
        Warehouse: 60,
        Comment: 'Created from web api',
      }
      deliveryTransactionLine = await Transaction.create(deliveryPurchasePayload)
        .fetch();
      transactionLines.push(deliveryTransactionLine);
      return transactionLines;
    }

    // check one final time that order is totally valid

    try {
      const order = await createOrder();
      const orderItemLines = await createItemOrderLines(order);
      const deliveryDetails = await createDeliveryOrderLine(order);
      const transactionLines = await createReserveOrderTransactionLines(
        orderItemLines,
        order,
        deliveryDetails
      );
      const combinedResults = {
        ...order,
        items: orderItemLines,
        delivery: deliveryDetails,
        transactions: transactionLines,
      };
      return exits.success(combinedResults);
    } catch (err) {
      return exits.invalid(err);
    }

    // VALIDATION
    // There must be some items at least 1

    // after we have the line numers, need to add their ids in a collection to the order

    // localStorage.setItem('storedData', inputs)
    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    // Since everything went ok, send our 200 response.

    // Need to roll back everything if something doesn't work
    // execute all funtions, if any fail - delete order and delete all order lines

    return exits.success();
  }

};
