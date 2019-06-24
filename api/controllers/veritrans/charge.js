module.exports = {


  friendlyName: 'Charge',


  description: 'Charge veritrans.',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The token which represents the credit card of the user',
      exmaple: '663cb156-0fc0-4ac0-8747-c7aadc35c9ed',
    },
    orderId: {
      type: 'string',
      required: true,
    },
    amount: {
      type: 'number',
      required: true,
      description: 'Purchase price in yen'
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
    const fetch = require("node-fetch");

    const ccid = "A100000000000001069951cc";
    const password = "ca7174bea6c9a07102fa990cfba330d0dad579a7c13a974fa7c3ec0ff66c1d6f";
    const req = {
      "orderId": inputs.orderId,
      "amount": inputs.amount,
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

    return exits.success(await result.json());


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
