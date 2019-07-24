module.exports = {


  friendlyName: 'Validate cart',


  description: 'Input a proposed cart, outputs a new valid cart',


  inputs: {
    timePeriod: {
      type: {
        // DateStart: "string",
        // DateEnd: "string",
      }
    },

    items: {
      type: [{
        // id: "string",
        // Quantity: "string"
      }]
    },

    shipping: {
      type: {
        // postcodeRaw: "string",
      }
    },

    OrderIdToIgnore: {
      type: 'number',
      description: 'If we are adding a recovered order, we dont want to calculate transactions from that order',
      example: 12,
    },
  },


  exits: {

    invalid: {
      responseType: 'badRequest',
      description: 'Inputs are not valid',
      extendedDescription: 'Inputs are not valid longer',
    },

  },


  fn: async function (inputs, exits) {

    const getValidTimePeriod = async function() {
      if (
        !inputs.timePeriod.DateStart ||
        !inputs.timePeriod.DateEnd
      ) {
        return {};
      }

      try {
        await sails.helpers.validateDaysOfUse(
          inputs.timePeriod.DateStart,
          inputs.timePeriod.DateEnd
        );
      } catch (err) {
        return exits.invalid(err.raw);
      }

      const daysOfUse = await sails.helpers.getDaysOfUse(
        inputs.timePeriod.DateStart,
        inputs.timePeriod.DateEnd
      );

      let response = {};
      response = {
        DateStart: inputs.timePeriod.DateStart,
        DateEnd: inputs.timePeriod.DateEnd,
        DaysOfUse: daysOfUse,
      };
      return response;
    }


    // All done.
    const validTimePeriod = await getValidTimePeriod();

    let returnCart = {
      timePeriod: validTimePeriod,
      items: [],
      shipping: {},
    };

    return exits.success(returnCart);

  }


};
