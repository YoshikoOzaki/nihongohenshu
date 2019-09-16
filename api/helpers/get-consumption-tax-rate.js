module.exports = {


  friendlyName: 'Get consumption tax rate',


  description: '',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Consumption tax rate',
    },

  },

  fn: async function (inputs) {

    var moment = require('moment');

    // const dateForRiseOfTax = moment("2019-10-10");
    const getConsumptionTaxRate = () => {
      // if (moment() >= dateForRiseOfTax ) {
      //   return 0.10;
      // }
      return 0.08;
    }

    // Send back the result through the success exit.
    return getConsumptionTaxRate();

  }


};
