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
    newCart: {},
    moment: moment,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    moment.locale("ja");
    console.log(this.me);
  },

  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    addReservedOrderToCart: async function() {
      try {
        await localStorage.setItem('cart', JSON.stringify(this.newCart));
        toastr.success('Added reserved order to the cart');
        setTimeout(window.location = '/rent/cart', 3000);
      } catch (err) {
        toastr.error('Could not add order to cart');
      }
    },

    submittedForm: async function() {
      // this.syncing = true;
      // window.location = '/checkout/cart';
      // window.location = '/rent/cart';
    },

    submitForm: async function() {
      const cart = await parasails.util.getCart();
      const payload = {
        OrderId: this.formData.OrderId,
        CustomerKeyword: this.formData.Keyword,
      }

      try {
        const order = await Cloud.recoverReservedOrder(..._.values(payload));
        await this.convertRecoveredOrderToCartSyntax(order);
        toastr.success('Recovered Order');
      } catch (err) {
        console.log(err);
        toastr.error('Could not recover order');
      }
      // get real order
      // convert cart to order
      // await localStorage.setItem('cart', JSON.stringify(order));
    },

    convertRecoveredOrderToCartSyntax: async function(recoveredOrder) {
      // should check all items, add the time, check shipping and add to cart
      // also start syncing here
      const newCartItems = [];
      // check all items - need to exclude this order
      if (recoveredOrder.OrderLineNumbers && recoveredOrder.OrderLineNumbers.length > 0) {
        // might need to add a price override here - price should be what it was reserved at
        // also need to not include any order lines that are from this order
        const checkCartItemAvailable = async function(orderLineNumber) {
          const payload = {
            Id: orderLineNumber.Product,
            Quantity: orderLineNumber.Quantity,
            DateStart: recoveredOrder.DateStart,
            DateEnd: recoveredOrder.DateEnd,
            DaysOfUse: recoveredOrder.DaysOfUse,
            OrderIdToIgnore: recoveredOrder.id,
          }
          if (orderLineNumber.Product !== null) {
            result = await Cloud.checkCartItemValid(..._.values(payload));
            return result;
          }
        };
        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }
        await asyncForEach(recoveredOrder.OrderLineNumbers, async (o) => {
          if (o.Product !== null) {
            const result = await checkCartItemAvailable(o);
            newCartItems.push(result);
          }
        });
      }
      // Add the time period
      const newCartTimePeriod = await Cloud.checkCartTimeValid(..._.values({
        DateStart: recoveredOrder.DateStart,
        DateEnd: recoveredOrder.DateEnd,
        DaysOfUse: recoveredOrder.DaysOfUse,
      }));

      // Add the shipping details
      // Check the shipping
      const shippingTransactionLine = _.find(recoveredOrder.OrderLineNumbers, { 'Glass': null });

      const newCartShipping = {
        postcode: recoveredOrder.Postcode,
        price: shippingTransactionLine.UnitPrice * shippingTransactionLine.Quantity,
      }

      const newCart = {
        items: [ ...newCartItems ],
        shipping: {
          ...newCartShipping,
        },
        timePeriod: {
          ...newCartTimePeriod,
        },
        orderIdToIgnore: recoveredOrder.id,
        reserveOrderKeyword: recoveredOrder.CustomerKeyword,
      };
      this.newCart = newCart;
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
