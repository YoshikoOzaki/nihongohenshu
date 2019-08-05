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

    validateCart: async function(cartToValidate) {
      const cart = cartToValidate;
      // TODO: remove un required cart elements

      if (
        cart.timePeriod === undefined ||
        cart.items === undefined ||
        cart.shipping === undefined
      ) {
        toastr.error('Could not validate cart');
        return;
      }

      const payload = {
        timePeriod: cart.timePeriod,
        items: cart.items,
        shipping: cart.shipping,
      }

      newCart = await Cloud.validateCart(..._.values(payload));
      // localStorage.setItem('cart', JSON.stringify(newCart));
      this.newCart = newCart;
    },

    convertRecoveredOrderToCartSyntax: async function(recoveredOrder) {
      // should check all items, add the time, check shipping and add to cart
      // also start syncing here
      const filteredOrderLines = _.filter(recoveredOrder.OrderLineNumbers, (o) => {
        return o.Product !== 160;
      });

      const payload = {
        timePeriod: {
          DateStart: recoveredOrder.DateStart,
          DateEnd: recoveredOrder.DateEnd,
          DaysOfUse: recoveredOrder.DaysOfUse,
        },
        items: [
          ..._.map(filteredOrderLines, (o) => {
            return {
              id: o.Product,
              Quantity: o.Quantity,
            }
          })
        ],
        shipping: {
          Postcode: recoveredOrder.Postcode,
        },
      };

      try {
        await this.validateCart(payload);
        toastr.success('Order validated');
      } catch (err) {
        console.log(err);
        toastr.error('Order could not be recovered and validated');
      }
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
