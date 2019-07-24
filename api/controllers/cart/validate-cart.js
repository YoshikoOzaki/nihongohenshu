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
      extendedDescription: 'validate-cart failed',
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

      const response = {
        DateStart: inputs.timePeriod.DateStart,
        DateEnd: inputs.timePeriod.DateEnd,
        DaysOfUse: daysOfUse,
      };
      return response;
    }

    const getValidShipping = async function() {
      if (
        !inputs.shipping.postcode ||
        !inputs.shipping.postcodeRaw ||
        !inputs.items
      ) {
        return {};
      }

      let getShippingDetails = {};
      try {
        getShippingDetails = await sails.helpers.validateShipping(
          inputs.shipping.postcode,
          inputs.shipping.postcodeRaw,
          inputs.items
        );
      } catch (err) {
        return exits.invalid(err.raw);
      }

      const response = {
        ...getShippingDetails,
      };
      return response;
    }

    const getQuantityDiscountFactorForFullRacks = async function() {
      if (
        !inputs.items
      ) {
        return '';
      }

      let quantityDiscountFactorForFullRacks;
      try {
        quantityDiscountFactorForFullRacks = await sails.helpers.getDiscountFactorForFullRacks(inputs.items);
      } catch (err) {
        return exits.invalid(err.raw);
      }
      const response = quantityDiscountFactorForFullRacks;
      return response;
    }

    const getValidItems = async function(quantityDiscountFactorForFullRacks, validTimePeriod) {
      if (
        !inputs.items
      ) {
        return [];
      }

      let validItems;
      try {
        validItems = await sails.helpers.validateItems(
          validTimePeriod.DateStart,
          validTimePeriod.DateEnd,
          validTimePeriod.DaysOfUse,
          inputs.items,
          quantityDiscountFactorForFullRacks,
        );
      } catch (err) {
        return exits.invalid(err.raw);
      }


      const response = {
        ...validItems,
      };
      return response;
    }

    // All done.
    const validTimePeriod = await getValidTimePeriod();
    const validShipping = await getValidShipping();
    const quantityDiscountFactorForFullRacks = await getQuantityDiscountFactorForFullRacks();
    const validItems = await getValidItems(quantityDiscountFactorForFullRacks, validTimePeriod);

    let returnCart = {
      timePeriod: validTimePeriod,
      items: validItems,
      shipping: validShipping,
    };

    return exits.success(returnCart);
  }
};
