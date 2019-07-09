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
    formDataShipping: {  /* … */  },
    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrorsTime: { /* … */ },
    formErrorsItems: { /* … */ },
    formErrorsShipping: { /* … */ },

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

    const products = await Cloud.getGlasses();
    this.glasses = _.filter(products, { 'Type': 'Glassware' });
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
    createOrderFromCart: async function() {
      const cart = await parasails.util.getCart();
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

    handleItemSubmitting: async function(data) {
      this.syncing = true;
      const getCartWithNewItem = async function(itemData) {
        oldCart = await parasails.util.getCart();
        const dataWithTimePeriod = {
          ...data,
          ...oldCart.timePeriod,
        }

        try {
          result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
          const newCart = {
            ...oldCart,
            items: [
              ...oldCart.items,
              result
            ],
          };
          return newCart;
          this.syncing = false;
        } catch (err) {
          toastr.error('Item could not be added to cart');
          console.log(err);
          this.syncing = false;
        }
      }

      const getCartWithNewItemAndShippingCalulated = async function(newCart){
        const getPostcode = () => {
          if (newCart.shipping && newCart.shipping.postcode) {
            return newCart.shipping.postcode;
          }
          return 0;
        }
        const getPostcodeRaw = () => {
          if (newCart.shipping && newCart.shipping.postcodeRaw) {
            return newCart.shipping.postcodeRaw;
          }
          return 0;
        }
        try {
          result = await Cloud.checkShippingPrice(
            getPostcode(),
            getPostcodeRaw(),
            newCart
          );
          const newCart2 = {
            ...newCart,
            shipping: {
              ...result
            },
          };
          return newCart2;
          this.syncing = false;
        } catch (err) {
          toastr.error('Item could not be added to cart');
          console.log(err);
          this.syncing = false;
        }
      }

      // TODO: fix this to proper async await try catch
      getCartWithNewItem(data).then(
        result => {
          getCartWithNewItemAndShippingCalulated(result).then(
            result2 => {
              if (result2) {
                localStorage.setItem('cart', JSON.stringify(result2));
                this.cart = result2;
                this.syncing = false;
                toastr.success('Added item to the cart');
                return;
              }
            }
          )
        }
      )
    },

    removeItemFromCart: async function(data) {
      const removeItemFromCart = async function(itemToRemove) {
        oldCart = await parasails.util.getCart();
        oldCartItemsWithItemRemoved = _.filter(oldCart.items, (item) => {
          return item.id !== data.id;
        });
        const newCart = {
          ...oldCart,
          items: oldCartItemsWithItemRemoved,
        };
        return newCart;
      }

      const getCartWithRemovedItemAndShippingCalculated = async function(newCart) {
        const postcode = () => {
          if (newCart.shipping && newCart.shipping.postcode) {
            return newCart.shipping.postcode;
          }
          return 0;
        }
        result = await Cloud.checkShippingPrice(newCart.shipping.Postcode || 0, newCart);
        const newCart2 = {
          ...newCart,
          shipping: {
            ...result
          },
        };
        if (result) {
          return newCart2;
        }
      }

      removeItemFromCart(data).then(
        result => {
          getCartWithRemovedItemAndShippingCalculated(result).then(
            result2 => {
              if (result2) {
                localStorage.setItem('cart', JSON.stringify(result2));
                this.cart = result2;
                return;
              }
            }
          )
        }
      )
    },

    handleParsingShippingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrorsShipping = {};

      var argins = this.formDataShipping;

      if(!argins.DateStart) {
        this.formErrorsTime.Postcode = true;
      }
      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrorsShipping).length > 0) {
        return;
      }

      return argins;
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
      console.log(argins);
      // Validate id:
      if(!argins.id) {
        this.formErrorsItems.id = true;
      }
      if(!argins.Quantity) {
        this.formErrorsItems.Quantity = true;
      }
      if(!argins.Quantity > 0) {
        // console.log(argins);
        this.formErrorsItems.QuantityNotAValidNumber = true;
      }
      // if(!cart.DateEnd || !cart.DateEnd) {
      //   this.formErrorsItems.noDateSeleted = true;
      // }
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
