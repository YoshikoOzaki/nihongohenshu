parasails.registerPage('reserve-guest', {
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
    this.cart = await parasails.util.getCart();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    submittedForm: async function() {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)

      // await parasails.util.clearCart();
      // should add the returned item to the cart
      // this.cart = await parasails.util.getCart();

      this.syncing = true;
      await parasails.util.clearCart();
      window.location = '/checkout/order-confirmation';
    },

    submitReserveOrder: async function() {
      const cart = await parasails.util.getCart();
      const availableOnlyItems = _.filter(cart.items, (o) => {
        return o.Available.available === "Available";
      });
      const payload = {
        DateStart: cart.timePeriod.DateStart,
        DateEnd: cart.timePeriod.DateEnd,
        DaysOfUse: cart.timePeriod.DaysOfUse,
        CustomerKeyword: this.formData.Keyword,
        Items: [
          ...availableOnlyItems
        ],
        Reserved: true,
        DeliveryCost: cart.shipping.Price,
        Postcode: cart.shipping.Postcode,
        PostcodeRaw: cart.shipping.PostcodeRaw,
        UserEmail: this.formData.Email,
      }

      const order = await Cloud.createReserveOrder(..._.values(payload));
      await localStorage.setItem('completedOrder', JSON.stringify(order));
    },

    handleParsingReserveForm: async function() {
      // Clear out any pre-existing error messages.
      this.formErrorsOrder = {};

      var argins = this.formData;
      // console.log(argins);

      if(!argins.Keyword) {
        this.formErrors.Keyword = true;
      }

      if(!argins.Email) {
        this.formErrors.Email = true;
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
