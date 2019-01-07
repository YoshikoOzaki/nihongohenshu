module.exports = {

  friendlyName: 'Check shipping price',


  description: 'Check the shipping price based on the items in the cart and the factors in the shipping db',


  extendedDescription:
  `Check the shipping price based on the items in the cart and the factors in the shipping db`,

  inputs: {
    Postcode:  {
      type: 'number',
      required: true,
      example: 1,
      description: 'The postcode of the item to be checked',
    },

    Cart: {
      type: {},
      required: true,
      description: 'All the items in the cart',
      example: {},
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
    // from the cart items and the post code, return the shipping cost

    // some japanese will have a '-' in them that needs to be cleared probably before here though
    const ShippingFactorRecord = await DeliveryCost.find({
      LowZip: { '<=': inputs.Postcode },
      HighZip: { '>=': inputs.Postcode }
    });

    // calculate price based on factor record and cart contents
    // from shipping factor get tak factor & truck factor
    // is truck or tak ? ->
    const vehicleTypeRequired = ShippingFactorRecord.Truck_Ok === 1 ? 'truck' : 'takuhai';

    if (vehicleTypeRequired === 'takuhai') {
      const takuhaiFactor = ShippingFactorRecord.Takuhai_Factor;
      const cartItems = inputs.Cart.items;

      const cartItemsCalculation = [];
      // get these from the db in case they change
      let partialRackCalulation = {
        36: 0,
        25: 0,
        16: 0,
        9: 0,
        10: 0,
      };

      async function calcRackRequirementsArray() {
        _.forEach(cartItems, async (cartItem, i) => {
          var product = await Glass.find({ id: inputs.Id }).limit(1);;
          console.log('product \n\n', product[0], '\n\n');
          console.log('old cart item \n\n', cartItem, '\n\n');

          const fullRacksRequired = Math.floor(cartItem.Quantity / product[0].RackCapacity);
          const quantityInPartialRacks = cartItem.Quantity - (fullRacksRequired * product[0].RackCapacity);

          const newCartItem = {
            productCode: cartItem.Id,
            quantityOfItems: cartItem.Quantity,
            rackCapactity: product[0].RackCapacity,
            fullRacksRequired,
            quantityInPartialRacks,
          };

          if (i === 0) { console.log('newCartItem \n\n', newCartItem, '\n\n') };
          cartItemsCalculation.push(newCartItem);
        });
      }

      async function calcPartialRacksRequired() {
        await _.forEach(cartItemsCalculation, async (item) => {
          const newValue = _.sum(partialRackCalulation[item.rackCapactity], item.quantityInPartialRacks);
          const newPartialRackCalulation = {
            ...partialRackCalulation,
            [item.rackCapactity]: newValue,
          }
          partialRackCalulation = newPartialRackCalulation;
        });
      }

      async function calcFullRacksRequired() {
        
      }


      await calcRackRequirementsArray();
      await calcPartialRacksRequired();

      console.log('partialRackCalulation \n\n', partialRackCalulation, '\n\n');
    }

    // calc tak
      // get rack requirements
        // calc full racks
        // calc partial racks
        // combine both rack amounts
        // bothRack / 2 (package can hold 2) (ceiling)
        // package * tak factor = price of tak delivery

    // calc truck


    returnPayload = {
      postcode: inputs.Postcode,
      price: "$100",
      shippingPossible: ShippingFactorRecord.length !== 0,
    };

    return exits.success(returnPayload);
  }

};
