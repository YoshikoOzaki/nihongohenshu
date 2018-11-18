module.exports = {

  friendlyName: 'Check rental cart item',


  description: 'Check if a rental item is valid to be placed in the cart.',


  extendedDescription:
  `Check if an item is valid for the cart, if so return the item to the front end with up to date data`,

  inputs: {

    Id:  {
      type: 'string',
      required: true,
      example: '1',
      description: 'The id of the item to be checked',
    },

    Quantity: {
      type: 'string',
      required: true,
      description: 'Total count of glasses of this type for the order',
      example: "555"
    },

    // should be able to change this to a date range picker with startdate enddate
  },

  exits: {

    dateTaken: {
      responseType: 'badRequest',
      description: 'The provided Date is already taken.',
      extendedDescription: 'Test'
    },

    invalid: {
      responseType: 'badRequest',
      description: 'The provided Item Id or Dates are invalid.',
      extendedDescription: 'If this request was sent from a graphical user interface, the request '+
      'parameters should have been validated/coerced _before_ they were sent.'
    },

  },


  fn: async function (inputs, exits) {
    // console.log(inputs);
    // add logic to check against other dates already taken and their quantities
    // if (inputs.DateStart === "2018-08-16") {
    //   throw 'dateTaken';
    // }

    // if all the validation passes - check the dates and item ids/skus
    // then just send back the validated item/order to add to the cart

    var item = await Glass.findOne({ id: inputs.Id });
    // get the days of use from the cart value

    // Collect variables
    const { Quantity } = inputs;
    const { RackCapacity, UnitPrice } = item;
    const washAndPolishConstant = 32;
    const daysOfUseDiscountFactor = 1;

    const basePrice = UnitPrice - washAndPolishConstant;
    const fullRacks = Quantity / RackCapacity;
    const fullRacksRoundedDown = Math.floor(fullRacks);
    const quantityInFullRacks = RackCapacity * fullRacksRoundedDown;
    const quantityInPartiallyFullRack = Quantity - quantityInFullRacks;

    const quantityFactorForFullRack = 0.9;
    const quantityFactorForPartialRack = 0.9;

    // Create Prices
    // ------

    const totalPrice = Quantity * UnitPrice;

    // Remove washing cost, calculate for full and partial racks the discount as a lump sum
    const discountedBasePrice =
      ((
        basePrice *
        daysOfUseDiscountFactor *
        quantityFactorForFullRack *
        quantityInFullRacks
      )
      +
      (
        basePrice *
        daysOfUseDiscountFactor *
        quantityFactorForPartialRack *
        quantityInPartiallyFullRack
      ));

    // Divide it by the total quantity and add was cost back on to get discounted unit price
    const discountedUnitPrice = discountedBasePrice / Quantity + washAndPolishConstant;

    // Use the new discounted unit price to calculate the discounted total cost
    const discountedTotalPrice = discountedUnitPrice * Quantity;

    discountedInputs = {
      Id: inputs.Id,
      Name: item.NameEng,
      Quantity: inputs.Quantity,
      UnitPrice: item.UnitPrice,
      TotalPrice: totalPrice,
      DiscountedUnitPrice: Math.round(discountedUnitPrice),
      DiscountedTotalPrice: Math.round(discountedTotalPrice),
    }
    console.log(discountedInputs);

    return exits.success(discountedInputs);
  }

};
