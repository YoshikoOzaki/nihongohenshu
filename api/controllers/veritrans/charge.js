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
    const ccid = "A100000000000001069951cc";
    const password = "ca7174bea6c9a07102fa990cfba330d0dad579a7c13a974fa7c3ec0ff66c1d6f";
    const req = {
      "orderId":"dummy1503015213",
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
    var hash = crypto.createHash('sha256').update(reqString).digest('base64');

    // async function sha256(message) {
    //   // console.log(message);
    //   // encode as UTF-8
    //   const msgBuffer = new TextEncoder('utf-8').encode(message);

    //   // hash the message
    //   const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    //   // convert ArrayBuffer to Array
    //   const hashArray = Array.from(new Uint8Array(hashBuffer));

    //   // convert bytes to hex string
    //   const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    //   return hashHex;
    // }
    // const getAuthHash = await sha256(ccid + reqString + password);

    const payload =
    {
      "params": {
        ...req,
      },
      "authHash": hash,
    };
    console.log(JSON.stringify(payload));
    return exits.success(payload);


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
