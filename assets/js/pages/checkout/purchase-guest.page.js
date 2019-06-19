parasails.registerPage('purchase-guest', {
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
      // window.location = '/checkout/order-confirmation';
    },

    submitReserveOrder: async function() {
      // first validate the cart
      // check that the value of the cart isn't different to a recalulation of the cart
      // use the result of the check as the value

      const getToken = async function() {
        const tokenPayload = {
          "card_number":"4111111111111111",
          "card_expire":"01/20",
          "security_code":"123",
          "token_api_key":"cd76ca65-7f54-4dec-8ba3-11c12e36a548",
          "lang":"en",
        }

        const tokenObj = await fetch('https://api.veritrans.co.jp/4gtoken', {
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
            body: JSON.stringify(tokenPayload),
          }
        )
        .then(async function(response) {
          return response.json();
        })

        // console.log('token: ' + JSON.stringify(tokenObj) );
        return tokenObj;
      }

      const chargeCard = async function(token) {
        // cant just use the cart details -> they need to be validated
        const cart = await parasails.util.getCart();

        chargePayload = {
          token: token.token,
          orderId: '',
          amount: (_.sum(cart.items, (o) => { return o.DiscountedTotalPrice }) + cart.shipping.price),
        }

        try {
          const chargeResult = await Cloud.charge(..._.values(chargePayload));
          return chargeResult;
        } catch(err) {
          console.log(err);
        }
      }

      // create order to get order id - mark as unpaid
      // charge via api -> if success -> change order to paid
      // if any steps fail delete order by id

      const createGuestOrder = async function() {
        console.log('runnning');
        const cart = await parasails.util.getCart();
        // need to add address to the order
        const orderPayload = {
          DateStart: cart.timePeriod.DateStart,
          DateEnd: cart.timePeriod.DateEnd,
          DaysOfUse: cart.timePeriod.DaysOfUse,
          GuestName: this.formData.customerName,
          Items: cart.items,
          Reserved: false,
          DeliveryCost: cart.shipping.price,
          Postcode: cart.shipping.postcode,
        }

        try {
          const order = await Cloud.createGuestOrder(..._.values(orderPayload));
          await console.log(order);
          await localStorage.setItem('completedOrder', JSON.stringify(order));
        } catch(err) {
          console.log(err);
        }
      }

      const ccToken = await getToken();
      const chargeCardResult = await chargeCard(ccToken);
      console.log(chargeCardResult);
      // const createGuestOrder = await createGuestOrder();

    },

    handleParsingReserveForm: async function() {
      // Clear out any pre-existing error messages.
      this.formErrorsOrder = {};

      var argins = this.formData;
      // console.log(argins);

      if(!argins.Keyword) {
        this.formErrors.Keyword = true;
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
