parasails.registerPage('selection', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    // Main syncing/loading state for this page.
    syncing: false,

    // Form data
    formData: { /* … */ },

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

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
        'Plumm Glass Flute (Handmade)',
        '555',
        'http://plumm-glasses.jp/media/catalog/product/cache/5/image/600x450/9df78eab33525d08d6e5fb8d27136e95/f/l/flute-handmade.jpg',
        '167',
      );
      // console.log(result);
    },

    getGlasses: async function() {
      // result = await io.socket.get('/glass?sort=createdAt DESC');
      result = await Cloud.getGlasses();
      this.glasses = result;
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

    handleSubmitting: async function(data) {
      console.log(..._.values(data));
      result = await Cloud.checkCartItemValid(..._.values(data));

      // console.log(result);
      oldCart = await parasails.util.getCart();
      const newCart = [
        ...oldCart,
        result,
      ];
      console.log(result, oldCart);

      if (result) {
        localStorage.setItem('cart', JSON.stringify(newCart));
        console.log(localStorage);
      }
    },

    handleParsingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData;

      // Validate id:
      if(!argins.Id) {
        this.formErrors.Id = true;
      }
      if(!argins.Quantity) {
        this.formErrors.Quantity = true;
      }
      if(!argins.DateStart) {
        this.formErrors.DateStart = true;
      }
      if(!argins.DateEnd) {
        this.formErrors.DateEnd = true;
      }
      if(!argins.DaysOfUse) {
        this.formErrors.DaysOfUse = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

  }
});
