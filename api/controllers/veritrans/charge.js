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
    const chargeTheCard = async function (orderId, amount) {

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
          id: inputs.orderId,
        }).set({
          Paid: true,
        }).fetch();

        // delete any old reserve order as the new order replaces it
        if (inputs.reserveOrderId) {
          await Transaction.destroy({
            OrderNumber: inputs.reserveOrderId
          })
          await OrderLineNumber.destroy({
            Order: inputs.reserveOrderId
          });
          await Order.destroy({
            id: inputs.reserveOrderId
          });
        }
      }

      if (resultJson.result.mstatus === 'failure') {
        // delete the newly unpaid order as it no longer matters
        await Transaction.destroy({
          OrderNumber: inputs.orderId
        });
        await OrderLineNumber.destroy({
          Order: inputs.orderId,
        });
        await Order.destroy({
          id: inputs.orderId
        });
      }

      const chargeResultWithOrder = {
        charge: {
          ...resultJson,
        },
        order: {
          ...await Order.findOne({
            id: inputs.orderId,
          }).populate('TakuhaiTimeSlot'),
        }
      }
      return chargeResultWithOrder;
    }

    const createOrder = async function() {
      orderInputs = {
        DateStart: validatedCart.timePeriod.DateStart,
        DateEnd: validatedCart.timePeriod.DateEnd,
        DaysOfUse: validatedCart.timePeriod.DaysOfUse,
        GuestName: inputs.orderDetails.CustomerName,
        Reserved: false,
        Postcode: validateCart.shipping.Postcode,
        PostcodeRaw: validateCart.shipping.Postcode,
        AddressLine1: inputs.orderDetails.AddressLine1,
        AddressLine2: inputs.orderDetails.AddressLine2,
        AddressLine3: inputs.orderDetails.AddressLine3,
        Telephone1: inputs.orderDetails.Telephone1,
        Email1: inputs.orderDetails.Email1,
        Comment: inputs.orderDetails.Comment,
        Paid: false,
        TakuhaiTimeSlot: inputs.orderDetails.TakuhaiTimeSlot,
        SubTotal: validatedCart.cartTotals.subTotal,
        TaxTotal: validatedCart.cartTotals.taxTotal,
        GrandTotal: validatedCart.cartTotals.grandTotal,
      }

      try {
        var newRecord = await Order.create(orderInputs).fetch();
        return newRecord;
      } catch (err) {
        console.log(err);
        return exits.invalid(err);
      }
    };

    
    const validatedCart = this.validateCart(inputs.cart);
    // check cart is the same when validated
    if (!_.isEqual(validatedCart, cart)) {
      return exits.invalid('cart is not equal to what it should be when validated on the api side');
    }

    // create guest order based on validated cart & input order details
    // we can add all the order lines etc after the credit card has been applied
    const createdOrder = await this.createOrder();

    // ADD HERE -> create order lines & transaction lines

    // update of order to paid or deletion of order is handled within this function
    // so we just need to then add in all the required order lines for the order if the payment 
    // was successful
    const chargeCardResult = await this.chargeTheCard(
      createdOrder.id, 
      validatedCart.cartTotals.grandTotal
    );

    // TODO: NEXT STEP
    // if charge card result is good - add all the order lines and transactions required for the order
    // actually, we should do this first, becuase if it fails after the charge is made we cant reverse the charge
    // must charge the card very last as the final part of this whole process
    // 




    // 1 validate cart -> compare to old cart to check its untampered with
    // 2 create guest order based on validated cart
    // 3 use guest order id, order totals, and cc token to make the charge
    // 4 if it fails, delete the unpaid guest order


    return exits.success(await returnPayload);


    // await vt.transaction.charge(transaction, (err, result) => {
    //   if (err) {
    //     console.error(err.response.error);
    //     // return res.redirect('/pay/error');
    //     return exits.invalid(err);
    //   }
    //   return exits.success(result);
    // });

    // All done.
    // return exits.success();
  }


};
