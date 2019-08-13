module.exports = {


  friendlyName: 'Validate cart helper',


  description: '',


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

    success: {
      description: 'All done.',
    },

    invalid: {
      responseType: 'badRequest',
      description: 'Inputs are not valid',
      extendedDescription: 'validate-cart failed',
    },
  },


  fn: async function (inputs, exits) {
    // TODO

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
        !inputs.shipping.Postcode ||
        !inputs.items
      ) {
        return {};
      }

      let getShippingDetails = {};
      try {
        getShippingDetails = await sails.helpers.validateShipping(
          inputs.shipping.Postcode,
          inputs.shipping.PostcodeRaw || inputs.shipping.Postcode.toString(),
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

    const getQuantityDiscountFactorForFullRacks = async function (itemsWithAvailability) {
      if (
        !itemsWithAvailability
      ) {
        return '';
      }

      let quantityDiscountFactorForFullRacks;
      try {
        quantityDiscountFactorForFullRacks = await sails.helpers.getDiscountFactorForFullRacks(itemsWithAvailability);
      } catch (err) {
        return exits.invalid(err.raw);
      }
      const response = quantityDiscountFactorForFullRacks;
      return response;
    }

    const getValidItems = async function(itemsWithAvailability, quantityDiscountFactorForFullRacks, validTimePeriod) {
      if (
        !itemsWithAvailability
      ) {
        return [];
      }

      try {
        let validItems;
        validItems = await sails.helpers.validateItems(
          validTimePeriod.DateStart || '0',
          validTimePeriod.DateEnd || '0',
          validTimePeriod.DaysOfUse || '1',
          itemsWithAvailability,
          quantityDiscountFactorForFullRacks,
        );

        const response = [
          ...validItems,
        ];
        return response;
      } catch (err) {
        console.log(err);
        return exits.invalid(err.raw || err.message);
      }
    }

    const addAvailabilityToItems = async function(validTimePeriod) {
      if (
        !inputs.items
      ) {
        return [];
      }
      let validItems;
      try {
        validItems = await sails.helpers.getItemsAvailability(
          validTimePeriod.DateStart || '0',
          validTimePeriod.DateEnd || '0',
          validTimePeriod.DaysOfUse || '1',
          inputs.items,
          inputs.OrderIdToIgnore || undefined,
        );
      } catch (err) {
        console.log(err);
        return exits.invalid(err);
      }
      const response = [
        ...validItems,
      ];
      return response;
    }

    // All done.
    const validTimePeriod = await getValidTimePeriod();
    const validShipping = await getValidShipping();
    const itemsWithAvailability = await addAvailabilityToItems(validTimePeriod);
    const quantityDiscountFactorForFullRacks = await getQuantityDiscountFactorForFullRacks(itemsWithAvailability);
    const validItems = await getValidItems(itemsWithAvailability, quantityDiscountFactorForFullRacks, validTimePeriod);
    const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
    const cartTotals = await sails.helpers.getCartTotals(validShipping, validItems, consumptionTaxRate);

    let returnCart = {
      timePeriod: validTimePeriod,
      items: validItems,
      shipping: validShipping,
      cartTotals,
      quantityDiscountFactorForFullRacks,
      OrderIdToIgnore: inputs.OrderIdToIgnore,
    };

    return exits.success(returnCart);

  }
};

