parasails.registerPage('selection', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formDataTime: { /* … */ },
    formDataItem: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrorsTime: { /* … */ },
    formErrorsItems: { /* … */ },

    // Server error state for the form
    cloudError: '',

    // empty glasses data on load
    glasses: [],

    // empty cart data before load
    cart: [],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function (){
    _.extend(this, window.SAILS_LOCALS);

    this.cart = await parasails.util.getCart();

    this.glasses = await Cloud.getGlasses();
  },

  mounted: async function() {
    //…
    this.$nextTick(function () {
      // Code that will run only after the
    })
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    createGlass: async function() {
      // console.log(Cloud);
      result = await Cloud.createGlass(
        'Rental Plumm Glass Flute',
        'ﾚﾝﾀﾙ用ﾌﾟﾗﾑ･ｸﾞﾗｽ ﾌﾙｰﾄ',
        '555',
        'http://plumm-glasses.jp/media/catalog/product/cache/5/image/600x450/9df78eab33525d08d6e5fb8d27136e95/f/l/flute-handmade.jpg',
        '167',
        '120',
        '36',
      );
      // console.log(result);
    },

    getGlasses: async function() {
      // result = await io.socket.get('/glass?sort=createdAt DESC');
      result = await Cloud.getGlasses();
      this.glasses = result;
    },

    createOrderFromCart: async function() {
      const cart = await parasails.util.getCart();
      console.log(cart);
      const payload = {
        DateStart: cart.timePeriod.DateStart,
        DateEnd: cart.timePeriod.DateEnd,
        DaysOfUse: cart.timePeriod.DaysOfUse,
        Items: cart.items,
      }

      order = await Cloud.createOrder(..._.values(payload));
    },

    submittedForm: async function() {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      // this.syncing = true;
      // window.location = '/rent/selection';
      // should add the returned item to the cart
      this.cart = await parasails.util.getCart();
    },

    handleTimeSubmitting: async function(data) {
      // check all the logic for order time & update cart
      result = await Cloud.checkCartTimeValid(..._.values(data));

      oldCart = await parasails.util.getCart();

      const newCart = {
        ...oldCart,
        timePeriod: {...result},
      };

      if (result) {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    },

    handleItemSubmitting: async function(data) {
      // check all the logic for order items & update cart
      result = await Cloud.checkCartItemValid(..._.values(data));

      oldCart = await parasails.util.getCart();

      const newCart = {
        ...oldCart,
        items: [
          ...oldCart.items,
          result
        ],
      };
      console.log(newCart);

      if (result) {
        localStorage.setItem('cart', JSON.stringify(newCart));
      }
    },

    removeItemFromCart: async function(data) {
      oldCart = await parasails.util.getCart();

      oldCartWithItemRemoved = _.without(oldCart, data.Id);

      localStorage.setItem('cart', JSON.stringify(oldCartWithItemRemoved));
    },

    handleParsingTimeForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrorsTime = {};

      var argins = this.formDataTime;

      if(!argins.DateStart) {
        this.formErrorsTime.DateStart = true;
      }
      if(!argins.DateEnd) {
        this.formErrorsTime.DateEnd = true;
      }
      if(!argins.DaysOfUse) {
        this.formErrorsTime.DaysOfUse = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrorsTime).length > 0) {
        return;
      }

      return argins;
    },

    handleParsingItemForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrorsItems = {};

      var argins = this.formDataItem;

      // Validate id:
      if(!argins.Id) {
        this.formErrorsItems.Id = true;
      }
      if(!argins.Quantity) {
        this.formErrorsItems.Quantity = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrorsItems).length > 0) {
        return;
      }

      return argins;
    },

  }
});
