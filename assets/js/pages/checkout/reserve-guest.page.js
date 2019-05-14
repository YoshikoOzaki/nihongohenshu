parasails.registerPage('reserve-guest', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    syncing: false,
    cloudError: '',
    formErrorsOrder: { /* … */ },
    formDataOrder: { /* … */ },
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
      // this.syncing = true;
      // await parasails.util.clearCart();
      // window.location = '/order-confirmation';
      // should add the returned item to the cart
      // this.cart = await parasails.util.getCart();
    },

    submitReserveOrder: async function() {
      const cart = await parasails.util.getCart();
      const payload = {
        DateStart: cart.timePeriod.DateStart,
        DateEnd: cart.timePeriod.DateEnd,
        DaysOfUse: cart.timePeriod.DaysOfUse,
        CustomerKeyword: this.formDataOrder.Keyword,
        Items: cart.items,
      }
      const order = await Cloud.createReserveOrder(..._.values(payload));
      await localStorage.setItem('completedOrder', JSON.stringify(order));
    },

    handleParsingReserveForm: async function() {
      // Clear out any pre-existing error messages.
      this.formErrorsOrder = {};

      var argins = this.formDataOrder;

      // Validate id:
      if(!argins.Keyword) {
        this.formErrorsOrder.Keyword = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrorsOrder).length > 0) {
        return;
      }

      return argins;
    }
  }
});
