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

    // validate cart -> compare to old cart to check its untampered with
    // create guest order based on validated cart
    // use guest order id, order totals, and cc token to make the charge
    // if it fails, delete the unpaid guest order

    const validateCart = async function (cartToValidate) {
      const cart = cartToValidate;
      const payload = {
        timePeriod: cart.timePeriod,
        items: cart.items,
        shipping: cart.shipping,
        OrderIdToIgnore: cart.OrderIdToIgnore,
      }

      const validatedCart = await sails.helpers.validateCartHelper(..._.values(payload));
    }

    // everything below here is the charge
    const chargeTheCard = async function () {
      const fetch = require("node-fetch");

      const ccid = "A100000000000001069951cc";
      const password = "ca7174bea6c9a07102fa990cfba330d0dad579a7c13a974fa7c3ec0ff66c1d6f";
      // TODO: remove the math floor number here for prod
      // it's here because the cc people deny you if you pay for the same order number twice
      const req = {
        "orderId": Math.floor(Math.random() * 100) + inputs.orderId + 10012,
        "amount": Math.round(inputs.amount),
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
