parasails.registerPage('order-recovery', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    syncing: false,
    cloudError: '',
    formErrors: { /* … */ },
    formData: { /* … */ },
    cart: [],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      // this.syncing = true;
      // window.location = '/checkout/cart';
    },

    submitForm: async function() {
      const cart = await parasails.util.getCart();
      const payload = {
        OrderId: this.formData.OrderId,
        CustomerKeyword: this.formData.Keyword,
      }

      const order = await Cloud.recoverReservedOrder(..._.values(payload));
      await this.convertRecoveredOrderToCart(order);
      // get real order
      // convert cart to order
      // await localStorage.setItem('cart', JSON.stringify(order));
    },

    convertRecoveredOrderToCart: async function(recoveredOrder) {
      // should check all items, add the time, check shipping and add to cart
      // also start syncing here
      const newCartItems = [];
      // check all items - need to exclude this order
      if (recoveredOrder.OrderLineNumbers && recoveredOrder.OrderLineNumbers.length > 0) {
        // might need to add a price override here - price should be what it was reserved at
        const checkCartItemAvailable = async function(item) {
          const dataWithTimePeriod = {
            Id: item.Glass,
            Quantity: item.Quantity,
            DateStart: recoveredOrder.DateStart,
            DateEnd: recoveredOrder.DateEnd,
          }
          if (item.Glass !== null) {
            result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
            return result;
          }
        };
        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }
        await asyncForEach(recoveredOrder.OrderLineNumbers, async (o) => {
          if (o.Glass !== null) {
            const result = await checkCartItemAvailable(o);
            newCartItems.push(result);
          }
        });
      }
      // Add the time period
      const newCartTimePeriod = await Cloud.checkCartTimeValid(..._.values({
        DateEnd: recoveredOrder.DateEnd,
        DateStart: recoveredOrder.DateStart,
        DaysOfUse: recoveredOrder.DaysOfUse,
      }));

      // Add the shipping details
      // Check the shipping
      console.log('test1');
      const shippingTransactionLine = _.find(recoveredOrder.OrderLineNumbers, { 'Glass': null });
      console.log(shippingTransactionLine);

      const newCartShipping = {
        postcode: recoveredOrder.Postcode,
        price: shippingTransactionLine.UnitPrice * shippingTransactionLine.Quantity,
      }
      console.log(newCartShipping);

      console.log(newCartItems);
      const newCart = {
        items: [ ...newCartItems ],
        shipping: {
          ...newCartShipping,
        },
        timePeriod: {
          ...newCartTimePeriod,
        },
      };
      console.log(newCart);
      // then check shipping is possible with the new cart

    },

    handleParsingForm: async function() {
      // Clear out any pre-existing error messages.
      this.formErrorsOrder = {};

      var argins = this.formData;
      // console.log(argins);

      if(!argins.Keyword) {
        this.formErrors.Keyword = true;
      }
      if(!argins.OrderId) {
        this.formErrors.OrderId = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    }
  }
});
