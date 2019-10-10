module.exports = {


  friendlyName: 'Create guest purchase order',


  description: 'Take a cc token and a cart of items, charge card and create order',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The token which represents the credit card of the user',
      exmaple: '663cb156-0fc0-4ac0-8747-c7aadc35c9ed',
    },
    cart: {
      type: {},
      required: true,
      description: 'The cart which will be processed into an order',
    },
    orderDetails: {
      type: {},
      required: true,
      description: 'All the details of the order',
    },
    isMemberOrder: {
      type: 'boolean',
      required: true,
      description: 'Is the user creating this order a member?'
    }

    // generate the below from validating cart and creating a guest order
    // orderId: {
    //   type: 'string',
    //   required: true,
    // },
    // amount: {
    //   type: 'number',
    //   required: true,
    //   description: 'Purchase price in yen'
    // },
    // reserveOrderId: {
    //   type: 'string',
    // },

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

    const validateCart = async function (cartToValidate) {
      const cart = cartToValidate;
      const payload = {
        timePeriod: cart.timePeriod,
        items: cart.items,
        shipping: cart.shipping,
        OrderIdToIgnore: cart.OrderIdToIgnore,
      }

      const validatedCart = await sails.helpers.validateCartHelper(..._.values(payload));
      return validatedCart;
    }

    // everything below here is the charge
    const chargeTheCard = async function (orderId, amount, reservedOrderId) {

      const fetch = require("node-fetch");

      const ccid = "A100000000000001069951cc";
      const password = "ca7174bea6c9a07102fa990cfba330d0dad579a7c13a974fa7c3ec0ff66c1d6f";
      // TODO: remove the math floor number here for prod
      // it's here because the cc people deny you if you pay for the same order number twice
      const req = {
        "orderId": Math.floor(Math.random() * 100) + orderId + 10012,
        "amount": Math.round(amount),
        "jpo":"10",
        "withCapture":"false",
        "payNowIdParam": {
          "token": inputs.token,
        },
        "txnVersion":"2.0.0",
        "dummyRequest":"1",
        "merchantCcid": ccid,
      }
      const reqString = JSON.stringify(req);

      var crypto = require('crypto');
      var hash = crypto.createHash('sha256').update(ccid + reqString + password).digest('hex');

      const payload =
      {
        "params": {
          ...req,
        },
        "authHash": hash,
      };

      const result = await fetch('https://api.veritrans.co.jp:443/test-paynow/v2/Authorize/card', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'no-cors', // no-cors, cors, *same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Accept-Language': 'ja',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(payload),
      })

      // if result is ok, update order id to paid
      const resultJson = await result.json();

      if (resultJson.result.mstatus === 'success') {
        updatedOrder = await Order.update({
          id: orderId,
        }).set({
          Paid: true,
        }).fetch();

        // delete any old reserve order as the new order replaces it
        if (reservedOrderId) {
          await Transaction.destroy({
            OrderNumber: reservedOrderId
          })
          await OrderLineNumber.destroy({
            Order: reservedOrderId
          });
          await Order.destroy({
            id: reservedOrderId
          });
        }
      }

      if (resultJson.result.mstatus === 'failure') {
        // delete the newly unpaid order as it no longer matters
        await Transaction.destroy({
          OrderNumber: orderId
        });
        await OrderLineNumber.destroy({
          Order: orderId,
        });
        await Order.destroy({
          id: orderId
        });
      }

      const chargeResultWithOrder = {
        charge: {
          ...resultJson,
        },
        order: {
          ...await Order.findOne({
            id: orderId,
          }).populate('TakuhaiTimeSlot'),
        }
      }
      return chargeResultWithOrder;
    }

    const createOrder = async function() {
      if (!inputs.isMemberOrder) {
        orderInputs = {
          DateStart: validatedCart.timePeriod.DateStart,
          DateEnd: validatedCart.timePeriod.DateEnd,
          DaysOfUse: validatedCart.timePeriod.DaysOfUse,
          GuestName: inputs.orderDetails.CustomerName,
          Reserved: false,
          Postcode: validatedCart.shipping.Postcode,
          PostcodeRaw: validatedCart.shipping.Postcode,
          AddressLine1: inputs.orderDetails.AddressLine1,
          AddressLine2: inputs.orderDetails.AddressLine2,
          AddressLine3: inputs.orderDetails.AddressLine3,
          Telephone1: inputs.orderDetails.Telephone1,
          Email1: inputs.orderDetails.Email1,
          Comment: inputs.orderDetails.Comment,
          Paid: false,
          TakuhaiTimeSlot: inputs.orderDetails.TakuhaiTimeSlot,
          ItemsTotal: validatedCart.cartTotals.itemsTotal,
          SubTotal: validatedCart.cartTotals.subTotal,
          TaxTotal: validatedCart.cartTotals.taxTotal,
          GrandTotal: validatedCart.cartTotals.grandTotal,
        }
      }
      if (inputs.isMemberOrder) {
        orderInputs = {
          User: inputs.orderDetails.User,
          DateStart: validatedCart.timePeriod.DateStart,
          DateEnd: validatedCart.timePeriod.DateEnd,
          DaysOfUse: validatedCart.timePeriod.DaysOfUse,
          GuestName: inputs.orderDetails.CustomerName,
          Reserved: false,
          Postcode: validatedCart.shipping.Postcode,
          PostcodeRaw: validatedCart.shipping.Postcode,
          AddressLine1: inputs.orderDetails.AddressLine1,
          AddressLine2: inputs.orderDetails.AddressLine2,
          AddressLine3: inputs.orderDetails.AddressLine3,
          Telephone1: inputs.orderDetails.Telephone1,
          Email1: inputs.orderDetails.Email1,
          Comment: inputs.orderDetails.Comment,
          Paid: false,
          TakuhaiTimeSlot: inputs.orderDetails.TakuhaiTimeSlot,
          ItemsTotal: validatedCart.cartTotals.itemsTotal,
          SubTotal: validatedCart.cartTotals.subTotal,
          TaxTotal: validatedCart.cartTotals.taxTotal,
          GrandTotal: validatedCart.cartTotals.grandTotal,
        }
      }

      try {
        var newRecord = await Order.create(orderInputs).fetch();
        return newRecord;
      } catch (err) {
        console.log(err);
        return exits.invalid(err);
      }
    };

    const createOrderItemLines = async function (order, validatedCart) {
      let itemResults = [];
      await asyncForEach(validatedCart.items, async (item, i) => {
        const itemInputs = {
          Quantity: Number(item.Quantity),
          UnitPrice: Number(item.UnitPrice),
          WashAndPolish: Number(item.WashAndPolish),
          QuantityDiscountFactor: Number(item.QuantityDiscountFactor),
          TotalPriceWithDiscountsAndWash: Number(item.TotalPriceWithDiscountsAndWash),
          Product: Number(item.id),
          Order: Number(order.id),
        }

        itemResults[i] = await OrderLineNumber.create(itemInputs)
          .fetch();
      });
      return itemResults;
    };

    const createDeliveryOrderLine = async function (order, validatedCart) {
      const payload = {
        Quantity: 1,
        UnitPrice: Number(validatedCart.shipping.TotalCalculatedDeliveryCharge),
        Order: Number(order.id),
        Product: 160,
        TotalPriceWithDiscountsAndWash: Number(validatedCart.shipping.TotalCalculatedDeliveryCharge),
      }
      let delivery = await OrderLineNumber.create(payload).fetch();
      return delivery;
    };

    const createReserveOrderTransactionLines = async function (orderLines, order, deliveryOrderLine) {
      let transactionLines = [];
      await asyncForEach(orderLines, async (orderLine, i) => {
        const reserveFromPayload = {
          OrderNumber: order.id,
          LineNumber: orderLine.id,
          TransactionType: 40, // rental order
          Product: orderLine.Product,
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
          Product: orderLine.Product,
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
        LineNumber: deliveryOrderLine.id,
        TransactionType: 60, // delivery cost
        Product: 160,
        Quantity: deliveryOrderLine.Quantity,
        UnitPrice: deliveryOrderLine.UnitPrice,
        Warehouse: 60,
        Comment: 'Created from web api',
      }
      deliveryTransactionLine = await Transaction.create(deliveryPurchasePayload)
        .fetch();
      transactionLines.push(deliveryTransactionLine);
      return transactionLines;
    }

    const validatedCart = await validateCart(inputs.cart);
    // check cart is the same when validated

    const cartTotalsEqual = _.isEqual(validatedCart.cartTotals, inputs.cart.cartTotals);
    const cartItemsEqual = _.isEqual(validatedCart.items, inputs.cart.items);
    const cartDiscountEqual = _.isEqual(validatedCart.quantityDiscountFactorForFullRacks, inputs.cart.quantityDiscountFactorForFullRacks);
    const cartShippingEqual = _.isEqual(_.without(validatedCart.shipping, 'ShippingFactorRecord'), _.without(inputs.cart.shipping, 'ShippingFactorRecord'));
    // const cartShippingFactorRecordEqual = _.isEqual(validatedCart.shipping.ShippingFactorRecord, inputs.cart.shipping.ShippingFactorRecord);
    const cartTimePeroidEqual = _.isEqual(validatedCart.timePeriod, inputs.cart.timePeriod);

    if (
      !cartTotalsEqual ||
      !cartItemsEqual ||
      !cartDiscountEqual ||
      !cartShippingEqual ||
      !cartTimePeroidEqual
    ) {
      return exits.invalid('cart is not equal to what it should be when validated on the api side');
    }

    const createdOrder = await createOrder();

    const createdOrderLines = await createOrderItemLines(createdOrder, validatedCart);
    const createdDeliveryOrderLine = await createDeliveryOrderLine(createdOrder, validatedCart);
    const createdOrderTransactionLines = await createReserveOrderTransactionLines(createdOrderLines, createdOrder, createdDeliveryOrderLine);

    const chargeCardResult = await chargeTheCard(
      createdOrder.id,
      validatedCart.cartTotals.grandTotal,
      inputs.cart.OrderIdToIgnore
    );

    // email user details of the created order
    // cant send any undefined
    if (chargeCardResult.charge.result.mstatus === 'success') {
      await sails.helpers.sendTemplateEmail.with({
        to: inputs.orderDetails.Email1,
        subject: 'Your Plumm Rental Confirmed Order Details',
        template: 'email-guest-purchase-confirmation',
        templateData: {
          guestName: inputs.orderDetails.GuestName,
          items: validatedCart.items,
          dateStart: validatedCart.timePeriod.DateStart,
          dateEnd: validatedCart.timePeriod.DateEnd,
          takuhaiTimeSlot: inputs.orderDetails.TakuhaiTimeSlot,
          postcodeRaw: validatedCart.shipping.Postcode,
          addressLine1: inputs.orderDetails.AddressLine1,
          addressLine2: inputs.orderDetails.AddressLine2,
          addressLine3: inputs.orderDetails.AddressLine3,
          comment: inputs.orderDetails.Comment || 'No comment entered',
          itemsTotal: validatedCart.cartTotals.itemsTotal,
          subTotal: validatedCart.cartTotals.subTotal,
          taxTotal: validatedCart.cartTotals.taxTotal,
          grandTotal: validatedCart.cartTotals.grandTotal,
        }
      });
    }

    const combinedResults = {
      cardCharge: chargeCardResult,
      order: createdOrder,
      items: createdOrderLines,
      delivery: createdDeliveryOrderLine,
      transactions: createdOrderTransactionLines,
    };

    return exits.success(combinedResults);
  }

};
