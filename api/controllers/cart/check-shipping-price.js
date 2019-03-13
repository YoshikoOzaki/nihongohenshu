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

      // currently this returns [] if there is no ShippingFactorRecord which happens if user hasn't added a postcode yet
      // wip
      // need to async get this value
      getValidTakuhaiFactor = (record) => {
        if (ShippingFactorRecord !== []) {
          return ShippingFactorRecord.Takuhai_Factor;
        }
        return 1;
      }
      TakuhaiUnitChargeObject = await TakuhaiUnitCharge.find({ 'TakuhaiFactor': getValidTakuhaiFactor(ShippingFactorRecord) });

      const cartItems = inputs.Cart.items;

      const buildRackRequirementArray = async function(){
        let cartItemsCalculation = [];

        for (const cartItem of cartItems) {
          var product = await Glass.find({ id: inputs.Id }).limit(1);

          const fullRacksRequired = Math.floor(cartItem.Quantity / product[0].RackCapacity);
          const quantityInPartialRacks = cartItem.Quantity - (fullRacksRequired * product[0].RackCapacity);

          const newCartItem = {
            productCode: cartItem.Id,
            quantityOfItems: cartItem.Quantity,
            rackCapactity: product[0].RackCapacity,
            fullRacksRequired,
            quantityInPartialRacks,
          };

          cartItemsCalculation.push(newCartItem);
        };

        return cartItemsCalculation;
      };

      const buildPartialRackRequiredObject = async function(rackRequirementsArray){
        // get these from the db in case they change
        let partialRackCalulationObject = {
          36: 0,
          25: 0,
          16: 0,
          9: 0,
          10: 0,
        };

        for (const item of rackRequirementsArray) {
          const newValue = partialRackCalulationObject[item.rackCapactity] + item.quantityInPartialRacks;
          const newPartialRackCalulation = {
            ...partialRackCalulationObject,
            [item.rackCapactity]: newValue,
          }
          partialRackCalulationObject = newPartialRackCalulation;
        };

        return partialRackCalulationObject;
      };

      const fullRacksRequiredFromPartialRacks = async function(partialRackRequiredObject) {
        const requiredRacks = Math.ceil(partialRackRequiredObject[36]/36) +
        Math.ceil(partialRackRequiredObject[25]/25) +
        Math.ceil(partialRackRequiredObject[16]/16) +
        Math.ceil(partialRackRequiredObject[9]/9) +
        Math.ceil(partialRackRequiredObject[10]/10);

        return requiredRacks;
      }

      const combinePartialRacksRequiredAndFullRacksRequired = async function(rackRequirementArray, requiredPartialRacks) {
        let totalRequiredFullRacks = 0;
        for (const item of rackRequirementArray) {
          totalRequiredFullRacks = totalRequiredFullRacks + item.fullRacksRequired;
        };

        return totalRequiredFullRacks + requiredPartialRacks;
      }

      buildRackRequirementArray().then(
        result => {
          buildPartialRackRequiredObject(result).then(
            result2 => {
              fullRacksRequiredFromPartialRacks(result2).then(
                result3 => {
                  combinePartialRacksRequiredAndFullRacksRequired(result, result3).then(
                    result4 => {
                      const totalNumberOfPackages = Math.ceil(result4/2) // line 47
                      const totalPrice = totalNumberOfPackages * TakuhaiUnitChargeObject.TakuhaiUnitCharge // look this up from tak factor on other data
                      const returnPayload = {
                        postcode: inputs.Postcode,
                        price: totalPrice,
                        shippingPossible: ShippingFactorRecord.length !== 0,
                        result2,
                      };

                      return exits.success(returnPayload);
                    }
                  )
                }
              )
            }
          );
        }
      );


    }

    // calc tak
      // get rack requirements
        // calc full racks
        // calc partial racks
        // combine both rack amounts
        // bothRack / 2 (package can hold 2) (ceiling)
        // package * tak factor = price of tak delivery

    // calc truck

  }

};
