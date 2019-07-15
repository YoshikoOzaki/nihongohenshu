module.exports = {


  friendlyName: 'Get consumption tax rate',


  description: 'Gets the current consumption tax rate',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var moment = require('moment');

    const dateForRiseOfTax = moment("2019-10-10");
    const getConsumptionTaxRate = () => {
      if (moment() > dateForRiseOfTax ) {
        return 0.10;
      }
      return 0.08;
    }

    return exits.success(getConsumptionTaxRate());

  }


};
