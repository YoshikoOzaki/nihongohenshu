module.exports = {


  friendlyName: 'Charge',


  description: 'Charge veritrans.',


  inputs: {
    token: {
      type: 'string',
      required: true,
      description: 'The token which represents the credit card of the user',
      exmaple: '663cb156-0fc0-4ac0-8747-c7aadc35c9ed',
    }
  },


  exits: {
    invalid: {
      responseType: 'badRequest',
      description: '',
      extendedDescription: ''
    },
  },


  fn: async function (inputs, exits) {

    const config = {
      serverKey: '0f3f6922-0e76-45c8-af74-2a444d466e38',
      clientKey: '157d22a4-5a57-47e0-9ac0-481e8944979c',
      url: 'https://api.veritrans.co.jp/vtdirect/v2'
    };
    const Veritrans = require('veritrans');
    const vt = new Veritrans(config);

    const transaction = {
      payment_type: 'credit_card',
      transaction_details: {
          order_id: 1,
          gross_amount: 9999,
      },
      credit_card: {
          token_id: inputs.token,
          bank: 'bni',
      },
    };
    await vt.transaction.charge(transaction, (err, result) => {
      if (err) {
        console.error(err.response.error);
        // return res.redirect('/pay/error');
        return exits.invalid(err);
      }
      return exits.success(result);
    });

    // All done.
    // return exits.success();
  }


};
