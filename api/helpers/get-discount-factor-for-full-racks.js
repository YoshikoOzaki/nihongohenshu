module.exports = {


  friendlyName: 'Get discount factor for full racks',


  description: '',


  inputs: {
    Items: {
      type: [{}],
      required: true,
      description: 'All the items in the cart',
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Discount factor for full racks',
    },

  },


  fn: async function (inputs) {
    // utility looping function
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    const cartItems = inputs.Items;
    const itemLineRackRequirements = [];
    await asyncForEach(cartItems, async(cartItem) => {
      let product = {};
      try {
        product = await Product.findOne({ id: cartItem.id });
      } catch (err) {
        return exits.invalid('Can not find one of the cart objects - ' + cartItem.id);
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
    });
    const totalRequiredFullRacks = _.sum(itemLineRackRequirements, (o) => {
      return o.fullRacksRequired;
    });

    // const discountFactor = Math.min(1, (_.sum([0.46, 0.551])/(Math.pow(1.04, totalRequiredFullRacks - 3))));


    const racksToThePowerOf = _.max([0, totalRequiredFullRacks - 3]);
    const discountFactor = 0.46 + 0.551 / Math.pow(1.04, racksToThePowerOf);

    const partialRacksInfo =
      _(itemLineRackRequirements)
      .groupBy('rackCapacity')
      .value();


    var discountFactorForFullRacks = {
      totalRequiredFullRacks,
      discountFactor,
      partialRacksInfo,
    };

    return discountFactorForFullRacks;

  }


};
