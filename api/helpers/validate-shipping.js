module.exports = {


  friendlyName: 'Validate shipping',


  description: '',


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

    Items: {
      type: [{}],
      required: true,
      description: 'All the items in the cart',
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

    invalid: {
      description: 'Inputs are not valid',
    },

  },


  fn: async function (inputs, exits) {
    // utility looping function
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    let ShippingFactorRecord = {};
    try {
      ShippingFactorRecord = await DeliveryCost.findOne({
        LowZip: { '<=': inputs.Postcode },
        HighZip: { '>=': inputs.Postcode }
      });
    } catch (err) {
      return exits.invalid('Could not get the shipping details for this postcode');
    }

    const vehicleTypeRequired = ShippingFactorRecord.Truck_OK === 1 ? 'truck' : 'takuhai';

    if (vehicleTypeRequired === 'truck') {
      const cartItems = inputs.Items;

      const getRacks = async function() {
        const itemLineRackRequirements = [];
        await asyncForEach(cartItems, async(cartItem) => {
          let product = {};
          try {
            product = await Product.findOne({ id: cartItem.id });
          } catch (err) {
            return exits.invalid('Can not find one of the cart objects - ' + cartItem.NameJ2);
          }
          const fullRacksRequired = Math.floor(cartItem.Quantity / product.RackCapacity);
          const partialRackItemQuantity = cartItem.Quantity - (fullRacksRequired * product.RackCapacity);
          const partialRacksRequired = partialRackItemQuantity > 0 ? 1 : 0;
          const requiredFullRackHeight = fullRacksRequired * product.RackHeight;
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
      const maxTruckDeliveryCharge = 10000; // TODO get from db or set at top or env variable
      const actualTruckDeliveryCharge = _.min([totalCalculatedDeliveryCharge, maxTruckDeliveryCharge]);

      const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
      const consumptionTax = actualTruckDeliveryCharge * consumptionTaxRate;
      const priceWithTax = actualTruckDeliveryCharge + consumptionTax;

      const response = {
        Postcode: inputs.Postcode,
        PostcodeRaw: inputs.PostcodeRaw,
        Price: actualTruckDeliveryCharge < 0  ? 0 : actualTruckDeliveryCharge,
        ConsumptionTax: consumptionTax,
        PriceWithTax: priceWithTax,
        ShippingPossible: true,
        ShippingType: 'truck',
        TotalCalculatedDeliveryCharge: totalCalculatedDeliveryCharge,
        ShippingFactorRecord: ShippingFactorRecord,
      };

      return exits.success(response);
    }

    if (vehicleTypeRequired === 'takuhai') {
      const cartItems = inputs.Items;
      let TakuhaiUnitChargeObject = {};
      try {
        TakuhaiUnitChargeObject = await TakuhaiUnitCharge.findOne({ 'TakuhaiFactor':
          ShippingFactorRecord.Takuhai_Factor || 1
        });
      } catch (err) {
        return exits.invalid('Could not get the Takuhai details for this postcode');
      }

      const buildRackRequirementArray = async function(){
        let cartItemsCalculation = [];
        for (const cartItem of cartItems) {
          let product = {};
          try {
            product = await Product.findOne({ id: cartItem.id });
          } catch (err) {
            return exits.invalid('Could not get shipping details for this postcode');
          }
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
        };
        return cartItemsCalculation;
      };

      const buildPartialRackRequiredObject = async function(rackRequirementsArray){
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

      const getFullRacksRequiredFromPartialRacks = async function(partialRackRequiredObject) {
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

      const rackRequirementArray = await buildRackRequirementArray();
      const partialRackRequirementArray = await buildPartialRackRequiredObject(rackRequirementArray);
      const fullRacksRequiredFromPartialRacks = await getFullRacksRequiredFromPartialRacks(partialRackRequirementArray);
      const combinedRacksRequired = await combinePartialRacksRequiredAndFullRacksRequired(rackRequirementArray, fullRacksRequiredFromPartialRacks);

      const totalNumberOfPackages = Math.ceil(combinedRacksRequired/2);
      const totalPrice = totalNumberOfPackages * TakuhaiUnitChargeObject.TakuhaiUnitCharge;
      const consumptionTaxRate = await sails.helpers.getConsumptionTaxRate();
      const consumptionTax = totalPrice * consumptionTaxRate;
      const priceWithTax = _.sum([totalPrice, consumptionTax]);

      const returnPayload = {
        Postcode: inputs.Postcode,
        PostcodeRaw: inputs.PostcodeRaw,
        Price: totalPrice,
        ConsumptionTax: consumptionTax,
        PriceWithTax: priceWithTax,
        ShippingFactorRecord,
        ShippingPossible: true,
        ShippingType: 'takuhai',
        PartialRackRequirementArray: partialRackRequirementArray,
      };
      return exits.success(returnPayload);
    }
  }
};
