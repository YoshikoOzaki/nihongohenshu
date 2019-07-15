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

    PostcodeRaw:  {
      type: 'string',
      example: '111-1111',
      description: 'The raw postcode value to be displayed to users',
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
    // utility looping function
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    // from the cart items and the post code, return the shipping cost

    // check for items

    // some japanese will have a '-' in them that needs to be cleared probably before here though
    const ShippingFactorRecord = await DeliveryCost.findOne({
      LowZip: { '<=': inputs.Postcode },
      HighZip: { '>=': inputs.Postcode }
    });

    // if theres no shipping record for the post code, return that it's not possible
    if (ShippingFactorRecord === undefined) {
      const returnPayload = {
        postcode: inputs.Postcode,
        postcodeRaw: inputs.PostcodeRaw,
        price: 0,
        shippingPossible: false,
      };

      return exits.success(returnPayload);
    }
    // calculate price based on factor record and cart contents
    // from shipping factor get tak factor & truck factor
    // is truck or tak ? ->
    const vehicleTypeRequired = ShippingFactorRecord.Truck_OK === 1 ? 'truck' : 'takuhai';

    if (vehicleTypeRequired === 'truck') {
      const cartItems = inputs.Cart.items;

      const getRacks = async function() {
        const itemLineRackRequirements = [];
        await asyncForEach(cartItems, async(cartItem) => {
          const product = await Product.findOne({ id: cartItem.id });
          const fullRacksRequired = Math.floor(cartItem.Quantity / product.RackCapacity);
          const partialRackItemQuantity = cartItem.Quantity - (fullRacksRequired * product.RackCapacity);
          const partialRacksRequired = partialRackItemQuantity > 0 ? 1 : 0;
          const requiredFullRackHeight = fullRacksRequired * product.RackHeight;
          // const requiredPartialRackHeight = partialRacksRequired * product[0].RackHeight;
          // const totalRacksRequired = fullRacksRequired + partialRacksRequired;

          itemLineRackRequirements.push(
            {
              productId: product.id,
              rackCapacity: product.RackCapacity,
              rackHeight: product.RackHeight,
              fullRacksRequired,
              partialRacksRequired,
              partialRackItemQuantity,
              requiredFullRackHeight,
            }
          );
        })
        const totalRequiredFullRackHeight = _.sum(itemLineRackRequirements, (o) => {
          return o.requiredFullRackHeight;
        });
        const totalRequiredFullRacks = _.sum(itemLineRackRequirements, (o) => {
          return o.fullRacksRequired;
        });
        const differentRackSizes = _.map(itemLineRackRequirements, (o) => {
          return o.rackCapacity;
        });

        // work out the extra height needed and racks needed for the additional glasses
        // these can be combined together into minimum height required racks to save adding extra racks
        const leftOverGlassesByRackCapacity = [];
        const uniqueRackSizes = _.unique(differentRackSizes);

        _.each(uniqueRackSizes, (rackCapacity) => {
          const itemsWithMatchingRackSize = _.filter(itemLineRackRequirements, { 'rackCapacity': rackCapacity })
          const leftOverGlasses = _.sum(itemsWithMatchingRackSize, (i) => {
            return i.partialRackItemQuantity;
          });
          const extraRacksRequired = _.ceil( leftOverGlasses / rackCapacity, 0);
          const itemsWithMatchingRackSizeRackHeights = _.map(itemsWithMatchingRackSize, 'rackHeight');
          const minimumRequiredRackHeight = _.max(itemsWithMatchingRackSizeRackHeights);
          const extraRequiredHeight = minimumRequiredRackHeight * extraRacksRequired;

          leftOverGlassesByRackCapacity.push({
            extraRacksRequired,
            rackCapacity,
            leftOverGlasses,
            minimumRequiredRackHeight,
            extraRequiredHeight,
          });
        })

        const extraRacksRequiredTotal = _.sum(leftOverGlassesByRackCapacity, 'extraRacksRequired');
        const extraHeightRequiredTotal = _.sum(leftOverGlassesByRackCapacity, 'extraRequiredHeight');
        const totalHeight = totalRequiredFullRackHeight + extraHeightRequiredTotal;
        const totalRacks = totalRequiredFullRacks + extraRacksRequiredTotal;

        const allRackHeights = _.map(itemLineRackRequirements, 'rackHeight');
        const tallestRack = _.max(allRackHeights);

        return {
          totalHeight,
          totalRacks,
          tallestRack,
        };
      }

      const racks = await getRacks();

      const maxHeightAllowablePerDolly = 1646; // TODO env variable
      const quantityOfDollys = _.ceil(racks.totalHeight / maxHeightAllowablePerDolly, 0);
      const remainingHeight = racks.totalHeight % maxHeightAllowablePerDolly;

      const calcExtraRacksFirstDolly = () => {
        if (racks.totalHeight >= maxHeightAllowablePerDolly) {
          return 4;
        }
        return _.ceil(racks.totalHeight / maxHeightAllowablePerDolly, 0) - 1;
        // the minus 1 is to make sure we leave one dolly for the calculation below
      }
      const extraRacksFirstDolly = calcExtraRacksFirstDolly();

      const extraDollysExceptLast = quantityOfDollys - 2;
      const remainingHeightLastDolly = racks.totalHeight - (1 + extraDollysExceptLast) * maxHeightAllowablePerDolly;

      const tallestRackHeight = racks.tallestRack;

      const getRacksOnLastDolly = () => {
        if (tallestRackHeight === 0) {
          return 0;
        }
        return _.ceil(remainingHeightLastDolly/tallestRackHeight, 0);
      }
      const racksOnLastDolly = getRacksOnLastDolly();

      // get these from db
      const TruckDistanceFactor = ShippingFactorRecord.Truck_Distance_Factor; // use to look up the ones below
      const TruckDistanceFactorCostResult = await TruckDistanceFactorCosting.findOne({ TruckDistanceFactor: TruckDistanceFactor });

      const minimumChargePer500x500ForTruck = TruckDistanceFactorCostResult.ChargeFirst500x500mm;
      const chargePerExtraRackFirstDolly = 600; // TODO env variable
      const chargePerExtraDolly = TruckDistanceFactorCostResult.ChargePerExtraDolly
      const chargeExtraRackFrom2ndDolly = TruckDistanceFactorCostResult.ChargePerExtraRackFromSecondDolly;

      const chargeFirstDolly = minimumChargePer500x500ForTruck + (chargePerExtraRackFirstDolly * extraRacksFirstDolly);
      const chargeExtraDollies = extraDollysExceptLast * chargePerExtraDolly;
      const chargeLastDollies = _.min([chargePerExtraDolly, (racksOnLastDolly * chargeExtraRackFrom2ndDolly)]);

      const totalCalculatedDeliveryCharge = _.sum([chargeFirstDolly, chargeExtraDollies, chargeLastDollies]);
      const maxTruckDeliveryCharge = 10000; // get from db or set at top or env variable
      const actualTruckDeliveryCharge = _.min([totalCalculatedDeliveryCharge, maxTruckDeliveryCharge]);

      const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
      const consumptionTax = actualTruckDeliveryCharge * consumptionTaxRate;
      const priceWithTax = actualTruckDeliveryCharge + consumptionTax;

      const response = {
        postcode: inputs.Postcode,
        postcodeRaw: inputs.PostcodeRaw,
        price: actualTruckDeliveryCharge < 0  ? 0 : actualTruckDeliveryCharge,
        consumptionTax,
        priceWithTax,
        shippingPossible: true,
        shippingType: 'truck',
        totalCalculatedDeliveryCharge,
        shippingFactorRecord: ShippingFactorRecord,
      };

      return exits.success(response);

      console.log('breakpoint');
      // total
      // Charge First Dolly + Charge Extra Dollies + Charge Last Dolly =
      // Total Calculated Truck Delivery Charge
      // if Total Calculated Truck Delivery Charge > maxDeliveryCharge then delivery is 10k
    }

    if (vehicleTypeRequired === 'takuhai') {

      // currently this returns [] if there is no ShippingFactorRecord which happens if user hasn't added a postcode yet
      // wip
      // need to async get this value
      const TakuhaiUnitChargeObject = await TakuhaiUnitCharge.findOne({ 'TakuhaiFactor':
        ShippingFactorRecord.Takuhai_Factor || 1
      });

      const cartItems = inputs.Cart.items;

      const buildRackRequirementArray = async function(){
        let cartItemsCalculation = [];

        for (const cartItem of cartItems) {
          try {
          const product = await Product.findOne({ id: cartItem.id });

          const fullRacksRequired = Math.floor(cartItem.Quantity / product.RackCapacity);
          const quantityInPartialRacks = cartItem.Quantity - (fullRacksRequired * product.RackCapacity);

          const newCartItem = {
            productCode: cartItem.id,
            quantityOfItems: cartItem.Quantity,
            rackCapactity: product.RackCapacity,
            fullRacksRequired,
            quantityInPartialRacks,
          };

          cartItemsCalculation.push(newCartItem);
          } catch (err) {
            return exits.error(err);
          }
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
                    async (result4) => {
                      const totalNumberOfPackages = Math.ceil(result4/2) // line 47
                      const totalPrice = totalNumberOfPackages * TakuhaiUnitChargeObject.TakuhaiUnitCharge // look this up from tak factor on other data

                      const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
                      const consumptionTax = totalPrice * consumptionTaxRate;
                      const priceWithTax = totalPrice + consumptionTax;

                      const returnPayload = {
                        postcode: inputs.Postcode,
                        postcodeRaw: inputs.PostcodeRaw,
                        price: totalPrice,
                        consumptionTax,
                        priceWithTax,
                        shippingFactorRecord: ShippingFactorRecord,
                        shippingPossible: true,
                        shippingType: 'takuhai',
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
