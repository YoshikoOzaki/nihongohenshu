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
    cart: [],
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
    this.glasses = await Cloud.getGlasses();
  },

  mounted: async function() {
    //…
  },

  updated: async function() {
    await this.checkIfCheckoutEnabled();
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
      // window.location = '/rent/selection';
      // should add the returned item to the cart
      this.cart = await parasails.util.getCart();
    },

    clearCart: async function() {
      this.cart = {};
      localStorage.removeItem('cart');
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
      parametersRequired.shippingCodeEntered = cart.shipping && cart.shipping.postcode > 0;
      parametersRequired.shippingCodeValid = cart.shipping && cart.shipping.shippingPossible !== false;
      parametersRequired.datesEntered = cart.timePeriod && !!cart.timePeriod.DateEnd && !!cart.timePeriod.DateStart;
      parametersRequired.daysOfUseEntered = cart.timePeriod && cart.timePeriod.DaysOfUse > 0;
      if (
        _.includes(parametersRequired, false)
      ) {
        this.checkoutEnabled = false;
        return;
      }
      this.checkoutEnabled = true;
    },

    createOrderFromCart: async function() {
      // const cart = await parasails.util.getCart();
      // const payload = {
      //   "card_number":"4111111111111111",
      //   "card_expire":"01/20",
      //   "security_code":"123",
      //   "token_api_key":"0ece37d8-f112-4f66-b57a-0ec8c66d9354",
      //   "lang":"en",
      // }

      // await fetch('https://api.veritrans.co.jp/4gtoken', {
      //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
      //     mode: 'cors', // no-cors, cors, *same-origin
      //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      //     credentials: 'same-origin', // include, *same-origin, omit
      //     headers: {
      //         'Content-Type': 'application/json',
      //         // 'Content-Type': 'application/x-www-form-urlencoded',
      //     },
      //     redirect: 'follow', // manual, *follow, error
      //     referrer: 'no-referrer', // no-referrer, *client
      //     body: JSON.stringify(payload),
      //   }
      // )
      // .then(async function(response) {
      //   return response.json();
      // })
      // .then(async function(myJson) {
      //   console.log(JSON.stringify(myJson));
      //   // then post token to the backend
      //   await Cloud.charge(myJson.token);
      // });

      // order = await Cloud.createOrder(..._.values(payload));

      const payload =
      {"params": {"orderId":"dummy1502869926"
        ,"amount":"5"
        ,"jpo":"10"
        ,"withCapture":"false"
        ,"payNowIdParam":{"token":"0a812412-682c-4dad-8a5d-720caf23bca0"}
        ,"txnVersion":"2.0.0"
        ,"dummyRequest":"1"
        ,"merchantCcid":"A100000000000001069951cc"
        }
        ,"authHash":" xxxxxxxxxxx "
      };

      await fetch('https://api.veritrans.co.jp:443/test-paynow /v2/Authorize/card', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(payload),
      });

    },

    handleTimeSubmitting: async function(data) {
      async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
          await callback(array[index], index, array);
        }
      }

      try {
      // check all the logic for order time & update cart
      oldCart = await parasails.util.getCart();
      timeValidResult = await Cloud.checkCartTimeValid(..._.values(data));
      } catch (err) {
        console.log(err);
        toastr.error('Time range could not be checked for being valid');
      }

      try {
      // check each item to update if available - START -
      // remove all if you want to remove function
        const newCartItems = [];
        if (oldCart.items && oldCart.items.length > 0) {
          const checkCartItemAvailable = async function(item) {
            const dataWithTimePeriod = {
              Id: item.Id,
              Quantity: item.Quantity,
              ...timeValidResult,
            }
            result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
            return result;
          };
          await asyncForEach(oldCart.items, async (o) => {
            const result = await checkCartItemAvailable(o);
            newCartItems.push(result);
          });
        }
        // check each item to update if available - END
        const newCart = {
          ...oldCart,
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

      // push in shipping code and current cart to check shipping function
      try {
        result = await Cloud.checkShippingPrice(..._.values(data), oldCart);

        const newCart = {
          ...oldCart,
          shipping: {
            ...result
          },
        };

        await localStorage.setItem('cart', JSON.stringify(newCart));
        toastr.success('Shipping added to the cart');
      } catch (err) {
        toastr.error('Shipping could not be added to the cart');
      }
    },

    handleItemSubmitting: async function(data) {
      const getCartWithNewItem = async function(itemData) {
        const oldCart = await parasails.util.getCart();
        const dataWithTimePeriod = {
          ...data,
          ...oldCart.timePeriod,
        }

        const result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
        const newCart = {
          ...oldCart,
          items: [
            ...oldCart.items,
            result
          ],
        };
        if (result) {
          return newCart;
        }
      }
      const getCartWithNewItemAndShippingCalulated = async function(newCart){
        const postcode = () => {
          if (newCart.shipping && newCart.shipping.postcode) {
            return newCart.shipping.postcode;
          }
          return 0;
        }
        result = await Cloud.checkShippingPrice(postcode(), newCart);
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

      try {
        const result = await getCartWithNewItem(data);
        const result2 = await getCartWithNewItemAndShippingCalulated(result);
        await localStorage.setItem('cart', JSON.stringify(result2));
        toastr.success('Item added to the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Item could not be added to the cart');
      }
    },

    removeItemFromCart: async function(data) {
      // this might not be updating the whole cart total price
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

      const getCartWithRemovedItemAndShippingCalculated = async function(newCart) {
        const postcode = () => {
          if (newCart.shipping && newCart.shipping.postcode) {
            return newCart.shipping.postcode;
          }
          return 0;
        }
        result = await Cloud.checkShippingPrice(newCart.shipping.postcode || 0, newCart);
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

      try {
        const result = await removeItemFromCart(data);
        const result2 = await getCartWithRemovedItemAndShippingCalculated(result);
        localStorage.setItem('cart', JSON.stringify(result2));
        this.cart = result2;
        toastr.success('Item removed from the cart');
      } catch (err) {
        console.log(err);
        toastr.error('Item could not be removed from the cart');
      }
    },

    updateItemRowQuantity: async function(index, quantity) {
      if (this.syncing) {
        return false;
      }
      this.syncing = true;
      try {
      const oldCart = await parasails.util.getCart();
      const dataWithTimePeriod = {
        Id: oldCart.items[index].Id,
        Quantity: quantity,
        ...oldCart.timePeriod,
      }

      const result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));

      const newCart = {
        ...oldCart,
      }
      newCart.items[index] = result;

      // this function can be extracted out, we need some testing set up to do this
      const getCartWithNewItemAndShippingCalulated = async function(newCart){
        const postcode = () => {
          if (newCart.shipping && newCart.shipping.postcode) {
            return newCart.shipping.postcode;
          }
          return 0;
        }
        const result = await Cloud.checkShippingPrice(postcode(), newCart);
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

      const newCartWithShippingAndTotals = await getCartWithNewItemAndShippingCalulated(newCart);
      await console.log(newCartWithShippingAndTotals);
      localStorage.setItem('cart', JSON.stringify(newCartWithShippingAndTotals));
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

      if(!argins.DateStart) {
        this.formErrorsTime.Postcode = true;
      }
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
