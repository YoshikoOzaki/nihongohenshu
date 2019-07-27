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
    taxRate: '',
    subTotal: '',
    taxTotal: '',
    grandTotal: '',
    cart: {
      items: [],
    },
    glasses: [],
    moment: moment,
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
  },

  updated: async function() {
    await this.checkIfCheckoutEnabled();

    const cart = this.cart;
    const taxRate = await Cloud.getConsumptionTaxRate();

    this.subTotal = ((_.sum(cart.items, (o) => { return o.TotalPriceWithDiscountsAndWash }) + cart.shipping.price) || 0);
    this.taxTotal = Math.round(((_.sum(cart.items, (o) => { return o.TotalPriceWithDiscountsAndWash }) + cart.shipping.price) || 0) * taxRate);
    this.grandTotal = (this.subTotal + this.taxTotal);
  },
  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

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
      this.cart = {};
      this.subTotal = '';
      this.grandTotal = '';
      localStorage.removeItem('cart');
    },

    calculateNewCart: async function(newCart){
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
      const result = await Cloud.checkShippingPrice(
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
      if (result) {
        return newCart2;
      }
    },

    // More functional methods

    validateCartTest: async function() {
      const cart = await parasails.util.getCart();
      // TODO: remove un required cart elements

      try {
        newCart = await Cloud.validateCart(..._.values(cart));
        localStorage.setItem('cart', JSON.stringify(newCart));
        this.cart = newCart;
      } catch (err) {
        console.log(err);
        toastr.error(err.responseInfo.body);
      }

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
      parametersRequired.cartItemsAreValid = cart.items && _.each(cart.items, (o) => {
        return o.Available.available === 'Available';
      }).length === cart.items.length;
      parametersRequired.shippingCodeEntered = cart.shipping && cart.shipping.Postcode;
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
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      try {
      // check all the logic for order time & update cart
      cart = await parasails.util.getCart();
      timeValidResult = await Cloud.checkCartTimeValid(..._.values(data));
      } catch (err) {
        console.log(err.responseInfo.body);
        toastr.error(err.responseInfo.body);
        return;
      }

      // check each item
      try {
        const newCartItems = [];
        if (cart.items && cart.items.length > 0) {
          const checkCartItemAvailable = async function(item) {
            const itemPayload = {
              Id: item.id,
              Quantity: item.Quantity,
              ...timeValidResult,
              OrderIdToIgnore: cart.orderIdToIgnore,
            }
            itemResult = await Cloud.checkCartItemValid(..._.values(itemPayload));
            return itemResult;
          };
          await asyncForEach(cart.items, async (o) => {
            const result = await checkCartItemAvailable(o);
            newCartItems.push(result);
          });
        }
        const newCart = {
          ...cart,
          items: newCartItems,
          timePeriod: {...timeValidResult},
        };
        localStorage.setItem('cart', JSON.stringify(newCart));
        toastr.success('Time range added to the cart');
        } catch (err) {
        console.log(err);
        toastr.error('Time range could not be added to the cart');
      }
    },

    handleShippingSubmitting: async function(data) {
      // check all the logic for order time & update cart
      oldCart = await parasails.util.getCart();
      console.log(data);
      // push in shipping code and current cart to check shipping function
      try {
        result = await Cloud.checkShippingPrice(
          data.Postcode,
          data.PostcodeRaw,
          oldCart,
        );

        const newCart = {
          ...oldCart,
          shipping: {
            ...result,
          },
        };

        await localStorage.setItem('cart', JSON.stringify(newCart));
        this.formDataShipping.Postcode = '';
        toastr.success('Shipping added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Shipping could not be added to the cart');
      }
    },

    handleItemSubmitting: async function(data) {
      // check if it's already in the cart
      const cart = await parasails.util.getCart();

      // this is a hack, it should be validated in one large function
      // probably with the rest of the cart logic
      const existingCartItemIndex = _.findIndex(cart.items, { id: data.Id });
      if (existingCartItemIndex >= 0) {
        toastr.warning('Item is already in the cart, please update it there');
        return;
      }

      const getCartWithNewItem = async function(itemData) {
        // this is a decent example of sending I think
        const itemPayload = {
          Id: data.Id,
          Quantity: data.Quantity,
          DateStart: cart.timePeriod.DateStart,
          DateEnd: cart.timePeriod.DateEnd,
          DaysOfUse: cart.timePeriod.DaysOfUse,
          OrderIdToIgnore: cart.OrderIdToIgnore,
        }
        const itemCheckResult = await Cloud.checkCartItemValid(..._.values(itemPayload));

        const newCart = {
          ...cart,
          items: [
            ...cart.items,
            itemCheckResult
          ],
        };
        if (itemCheckResult) {
          return newCart;
        }
      }

      try {
        const result = await getCartWithNewItem(data);
        const result2 = await this.calculateNewCart(result);
        await localStorage.setItem('cart', JSON.stringify(result2));
        toastr.success('Item added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Item could not be added to the cart' + err);
      }
    },

    removeItemFromCart: async function(data) {
      if (this.syncing) {
        return false;
      }
      // this might not be updating the whole cart total price
      this.syncing = true;
      const removeItemFromCart = async function(itemToRemove) {
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

      try {
        const result = await removeItemFromCart(data);
        const result2 = await this.calculateNewCart(result);
        localStorage.setItem('cart', JSON.stringify(result2));
        this.cart = result2;
        toastr.success('Item removed from the cart');
        this.syncing = false;
      } catch (err) {
        console.log(err);
        toastr.error('Item could not be removed from the cart');
        this.syncing = false;
      }
    },

    updateItemRowQuantity: async function(index, quantity) {
      if (this.syncing) {
        return false;
      }
      this.syncing = true;
      try {
      const cart = await parasails.util.getCart();
      const dataWithTimePeriod = {
        Id: cart.items[index].id,
        Quantity: quantity,
        DateStart: cart.timePeriod.DateStart,
        DateEnd: cart.timePeriod.DateEnd,
        DaysOfUse: cart.timePeriod.DaysOfUse,
        OrderIdToIgnore: cart.OrderIdToIgnore,
      }

      const result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));

      const newCart = {
        ...cart,
      }
      newCart.items[index] = result;

      const newCartWithShippingAndTotals = await this.calculateNewCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCartWithShippingAndTotals));
      this.cart = newCartWithShippingAndTotals;
      toastr.success('Item quantity changed');
      } catch (err) {
        console.log(err);
        toastr.error('Item quantity could not be changed');
      }
      this.syncing = false;
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
