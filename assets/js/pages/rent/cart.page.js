parasails.registerPage('cart', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    syncing: false,
    cloudError: '',
    formDataTime: {},
    formDataItem: { /* … */ },
    formDataShipping: {  /* … */  },
    formErrorsTime: { /* … */ },
    formErrorsItems: { /* … */ },
    formErrorsShipping: { /* … */ },
    checkoutEnabled: false,
    cart: {
      items: [],
      quantityDiscountFactorForFullRacks: {
        discountFactor: 0,
      },
      shipping: {},
      timePeriod: {},
    },
    glasses: [],
    moment: moment,
    minDate: '',
    maxDate: '',
    postcodeOverlayOn: false,
    timePeriodOverlayOn: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    moment.locale("ja");
    this.cart = await parasails.util.getCart();
    const products = await Cloud.getGlasses();
    this.glasses = _.filter(products, { Type: 'Glassware' });
    this.taxRate = await Cloud.getConsumptionTaxRate();
  },

  mounted: async function() {
    //…
    this.minDate = moment().add(7,'d').format('YYYY-MM-DD');
    this.maxDate = moment().add(2,'y').format('YYYY-MM-DD');
    const cart = await parasails.util.getCart();

    if (!cart.timePeriod.DateStart && !cart.timePeriod.DateEnd) {
      this.timePeriodOverlayOn = true;
    }

    if (!cart.shipping.Postcode) {
      if (this.timePeriodOverlayOn) {
        return;
      }
      this.postcodeOverlayOn = true;
    }

  },

  updated: async function() {
    await this.checkIfCheckoutEnabled();
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    turnOffOverlay: function () {
      this.timePeriodOverlayOn = false;
      this.postcodeOverlayOn = false;
    },

    // Helper methods

    submittedForm: async function() {
      // Redirect to the account page on success.
      // > (Note that we re-enable the syncing state here.  This is on purpose--
      // > to make sure the spinner stays there until the page navigation finishes.)
      // this.syncing = true;
      // window.location = '/rent/selection';
      // should add the returned item to the cart
      this.cart = await parasails.util.getCart();
    },

    clearCart: async function() {
      if (this.syncing) {
        return;
      }

      if (window.confirm("Are you sure you want to clear the cart?")) {
        const newCart = {
          items: [],
          quantityDiscountFactorForFullRacks: {
            discountFactor: 1,
          },
          shipping: {},
          timePeriod: {},
        };
        localStorage.setItem('cart', JSON.stringify(newCart));
        this.cart = newCart;
        toastr.success('The cart has been cleared');
      }
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
        OrderIdToIgnore: cart.OrderIdToIgnore,
      }

      newCart = await Cloud.validateCart(..._.values(payload));
      localStorage.setItem('cart', JSON.stringify(newCart));
      this.cart = newCart;
    },

    checkIfCheckoutEnabled: async function() {
      const cart = await parasails.util.getCart();

      const parametersRequired = {
        cartHasItems: false,
        cartItemsAreValid: false,
        shippingCodeEntered: false,
        shippingCodeValid: false,
        datesEntered: false,
        daysOfUseEntered: false,
      };

      parametersRequired.cartHasItems = cart.items && cart.items.length > 0;
      parametersRequired.cartItemsAreValid = cart.items && (cart.items.length > 0) && _.each(cart.items, (o) => {
        return o.Available.available === 'Available';
      }).length === cart.items.length;
      parametersRequired.shippingCodeEntered = cart.shipping && (cart.shipping.Postcode !== undefined);
      parametersRequired.shippingCodeValid = cart.shipping && cart.shipping.shippingPossible !== false;
      parametersRequired.datesEntered = cart.timePeriod && !!cart.timePeriod.DateEnd && !!cart.timePeriod.DateStart;
      parametersRequired.daysOfUseEntered = cart.timePeriod && cart.timePeriod.DaysOfUse > 0;

      if (_.includes(parametersRequired, false)) {
        this.checkoutEnabled = false;
        return;
      }
      this.checkoutEnabled = true;
    },

    handleTimeSubmitting: async function(data) {
      const cart = await parasails.util.getCart();
      const payload = {
        timePeriod: data,
        items: cart.items,
        shipping: cart.shipping,
        OrderIdToIgnore: cart.OrderIdToIgnore || undefined,
      };
      try {
        await this.validateCart(payload);
        toastr.success('Days of use added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Days of use could not be added to the cart');
      }
    },

    handleShippingSubmitting: async function (data) {
      const cart = await parasails.util.getCart();

      const payload = {
        timePeriod: cart.timePeriod,
        items: cart.items,
        shipping: data,
        OrderIdToIgnore: cart.OrderIdToIgnore || undefined,
      };
      try {
        await this.validateCart(payload);
        toastr.success('Shipping added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Shipping could not be added to the cart');
      }
    },

    handleItemSubmitting: async function(data) {
      console.log(data);
      const cart = await parasails.util.getCart();
      const existingCartItem = _.find(cart.items, { id: data.Id });
      if (existingCartItem) {
        toastr.warning('Item is already in the cart, please update it there');
        return;
      }
      const newItems = [
        ..._.without(cart.items, existingCartItem),
        {
          id: data.Id,
          Quantity: data.Quantity,
        }
      ];
      const payload = {
        timePeriod: cart.timePeriod,
        items: newItems,
        shipping: cart.shipping,
        OrderIdToIgnore: cart.OrderIdToIgnore || undefined,
      };
      try {
        const result = await this.validateCart(payload);
        console.log(result);
        toastr.success('Item added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Item could not added to the cart');
      }
    },

    removeItemFromCart: async function (data) {
      if (this.syncing) {
        return false;
      }
      this.syncing = true;
      const removeItemFromCart = async function () {
        oldCart = await parasails.util.getCart();
        oldCartItemsWithItemRemoved = _.filter(oldCart.items, (item, i) => {
          return i !== data.index;
        });
        const newCart = {
          ...oldCart,
          items: oldCartItemsWithItemRemoved,
        };
        return newCart;
      }
      const cartWithoutItemToRemove = await removeItemFromCart();

      const payload = {
        timePeriod: cartWithoutItemToRemove.timePeriod,
        items: cartWithoutItemToRemove.items,
        shipping: cartWithoutItemToRemove.shipping,
      };
      try {
        await this.validateCart(payload);
        toastr.success('Item removed from the cart');
        this.syncing = false;
      } catch (err) {
        console.log(err);
        toastr.error('Item could not be removed from the cart');
        this.syncing = false;
      }
    },

    updateItemRowQuantity: async function (index, quantity) {
      if (this.syncing) {
        return false;
      }
      this.syncing = true;
      const cart = await parasails.util.getCart();
      const newCartItems = [
        ...cart.items,
      ];
      newCartItems.splice(index, 1, {
        ...cart.items[index],
        Quantity: quantity
      });

      const payload = {
        timePeriod: cart.timePeriod,
        items: newCartItems,
        shipping: cart.shipping,
        OrderIdToIgnore: cart.OrderIdToIgnore || undefined,
      };
      console.log(cart.items);
      console.log(newCartItems);
      try {
        await this.validateCart(payload);
        toastr.success('Item quantity changed');
        this.syncing = false;
      } catch (err) {
        console.log(err);
        toastr.error('Item quantity could not be changed');
        this.syncing = false;
      }
    },

    handleParsingShippingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrorsShipping = {};

      var argins = this.formDataShipping;

      if(!argins.PostcodeRaw) {
        this.formErrorsShipping.PostcodeRaw = true;
      }

      const postCodePattern = new RegExp('\\d{3}-\\d{4}');
      const regexValidation = postCodePattern.test(argins.PostcodeRaw);

      if (!regexValidation) {
        this.formErrorsShipping.PostcodeRaw = true;
      }

      if (Object.keys(this.formErrorsShipping).length > 0) {
        return;
      }

      const postCodeFormatted = argins.PostcodeRaw.replace( '-', '');
      argins.Postcode = Number(postCodeFormatted);

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
      // if(!argins.DaysOfUse) {
      //   this.formErrorsTime.DaysOfUse = true;
      // }
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

      if (Object.keys(this.formErrorsItems).length > 0) {
        return;
      }

      return argins;
    },

  }
});
