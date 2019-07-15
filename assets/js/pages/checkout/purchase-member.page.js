parasails.registerPage('purchase-member', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    syncing: false,
    syncMessage: '',
    cloudError: '',
    formErrors: { /* … */ },
    formData: { /* … */ },
    cart: {
      shipping: {
        postcode: '',
      },
    },
    takuhaiTimeSlots: [],
    user: {},
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.formData.CustomerName = this.me.fullName;
    this.formData.AddressLine1 = this.me.AddressLine1;
    this.formData.AddressLine2 = this.me.AddressLine2;
    this.formData.AddressLine3 = this.me.AddressLine3;
    this.formData.Telephone1 = this.me.Telephone1;
    this.formData.Email1 = this.me.emailAddress;
  },
  mounted: async function() {
    //…
    console.log(this.me);
    this.cart = await parasails.util.getCart();
    this.takuhaiTimeSlots = await Cloud.getTakuhaiTimeSlots();
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

      // this.syncing = true;
      // window.location = '/checkout/order-confirmation';
      window.location = '/checkout/purchase-confirmation'
      await parasails.util.clearCart();
    },

    asyncForEach: async function(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    },

    reloadCart: async function() {
      this.cart = await parasails.util.getCart();
    },

    createMemberOrder: async function() {
      this.syncMessage = "Creating Order...";
      const cart = await parasails.util.getCart();
      // need to add address to the order
      // any created orders will go in as unpaid
      // only backend can change to paid
      // this should really be included in charge though
      const orderPayload = {
        User: this.me.id,
        DateStart: cart.timePeriod.DateStart,
        DateEnd: cart.timePeriod.DateEnd,
        DaysOfUse: cart.timePeriod.DaysOfUse,
        GuestName: this.formData.CustomerName,
        Items: _.filter(cart.items, (o) => {
          return o.Available.available === 'Available';
        }),
        Reserved: false,
        DeliveryCost: cart.shipping.price,
        Postcode: cart.shipping.postcode,
        AddressLine1: this.formData.AddressLine1,
        AddressLine2: this.formData.AddressLine2,
        AddressLine3: this.formData.AddressLine3,
        Telephone1: this.formData.Telephone1,
        Email: this.formData.Email1,
        Comment: this.formData.Comment,
        TakuhaiTimeSlot: this.formData.TakuhaiTimeSlot,
      }
      let order = {};
      try {
        order = await Cloud.createMemberOrder(..._.values(orderPayload));
      } catch(err) {
        console.log(err);
        toastr.error(err);
        this.syncMessage = "";
      }
      // await localStorage.setItem('completedOrder', JSON.stringify(order));
      this.syncMessage = "";
      return order;
    },

    getToken: async function() {
      // get details from user form
      // token api key should come from env variables
      this.syncMessage = "Validating Credit Card...";
      // const tokenPayload = {
      //   "card_number":"4111111111111111",
      //   "card_expire":"01/20",
      //   "security_code":"123",
      //   "token_api_key":"cd76ca65-7f54-4dec-8ba3-11c12e36a548",
      //   "lang":"en",
      // }
      const tokenPayload = {
        "card_number":  this.formData.CardNumber,
        "card_expire":  this.formData.CardExpireMonth + "/" + this.formData.CardExpireYear,
        "security_code":  this.formData.SecurityCode,
        "token_api_key":  "cd76ca65-7f54-4dec-8ba3-11c12e36a548",
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
    },

    chargeCard: async function(token, orderId) {
      if (!token || !orderId) {
        console.log('No token or order Id');
        return;
      }
      // maybe i create and delete the order in here
      // pass in the order and the charge that needs to be made
      // create -> charge -> delete
      // no this should all be done on the api...
      this.syncMessage = "Charging Credit Card...";
      // cant just use the cart details -> they need to be validated
      const cart = await parasails.util.getCart();

      chargePayload = {
        token: token.token,
        orderId: orderId,
        amount: (_.sum(cart.items, (o) => { return o.DiscountedTotalPrice }) + cart.shipping.price),
        reserveOrderId: cart.orderIdToIgnore,
      };

      try {
        const chargeResult = await Cloud.charge(..._.values(chargePayload));
        return chargeResult;
      } catch (err) {
        toastr.error(err);
        return;
      }
    },

    checkAllCartAvailability: async function() {
      const newCartItems = [];
      const cart = await parasails.util.getCart();
      this.syncMessage = "Checking Cart Items... " + "0/" + cart.items.length;
      if (cart.items && cart.items.length > 0) {
        const checkCartItemAvailable = async function(item) {
          const dataWithTimePeriod = {
            Id: item.id,
            Quantity: item.Quantity,
            ...cart.timePeriod,
            OrderIdToIgnore: cart.orderIdToIgnore,
          }
          // TODO: need to add order to ignore if it exists in the cart
          // so it doesn't double check items
          result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
          return result;
        };
        await this.asyncForEach(cart.items, async (o, i) => {
          this.syncMessage = "Checking Cart Items... " + (i+1) +"/" + cart.items.length;
          const result = await checkCartItemAvailable(o);
          newCartItems.push(result);
        });
      }
      // check if any have changed from available status to not available
      const changedAvailabilites = [];
      _.forEach(cart.items, (o, i) => {
        if (o.Available.available !== newCartItems[i].Available.available) {
          changedAvailabilites.push(i);
        }
      })

      if (changedAvailabilites.length > 0) {
        return false;
      }
    },

    submitReserveOrder: async function() {

      // check cart has some items
      const cart = await parasails.util.getCart();
      const cartAvailableItems = _.filter(cart.items, (o) => {
        return o.Available.available === 'Available';
      })
      if (cartAvailableItems.length === 0) {
        toastr.warning('You have no available items in the cart');
        return;
      }

      // check cart items are still available
      const cartAvaiable = await this.checkAllCartAvailability();
      if (cartAvaiable === false) {
        this.syncMessage = '';
        toastr.error('Some cart item availabilities have changed, refresh the cart to see the differences');
        return;
      }

      // get cc token
      const ccToken = await this.getToken();
      if (ccToken.status === 'failure') {
        toastr.error(ccToken.message);
        return;
      }
      // create an unpaid order
      let order = {};
      try {
        order = await this.createMemberOrder();
      } catch (err) {
        console.log(err);
        return;
      }

      // charge card and update order to paid
      const chargeCardResult = await this.chargeCard(ccToken, order.id);

      if (chargeCardResult.charge.result.mstatus === 'failure') {
        toastr.error('Credit Card Error ' + chargeCardResult.charge.result.merrMsg);
      }

      if (chargeCardResult.charge.result.mstatus === 'success') {
        toastr.success('Order Created ' + chargeCardResult.charge.result.merrMsg);
        await localStorage.setItem('completedOrder', JSON.stringify(chargeCardResult.order));
        await localStorage.setItem('completedOrder', JSON.stringify(chargeCardResult.order));
      }

      this.syncMessage = '';
    },

    handleParsingReserveForm: function() {
      // dont make this async or it will fuck up the ajax form
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.formData;

      if(!argins.CustomerName) {
        this.formErrors.CustomerName = true;
      }
      if(!argins.AddressLine1) {
        this.formErrors.AddressLine1 = true;
      }
      if(!argins.Telephone1) {
        this.formErrors.Telephone1 = true;
      }
      if(!argins.Email1) {
        this.formErrors.Email1 = true;
      }
      if(!argins.CardNumber) {
        this.formErrors.CardNumber = true;
      }
      if(!argins.SecurityCode) {
        this.formErrors.SecurityCode = true;
      }
      if(!argins.CardExpireYear || !argins.CardExpireMonth) {
        this.formErrors.CardExpire = true;
      }

      if(!argins.SecurityCode.length === 3 || !argins.SecurityCode.length === 4) {
        this.formErrors.SecurityCodeLength = true;
      }

      argins.CardExpireMonth = String("0" + argins.CardExpireMonth).slice(-2);
      argins.CardExpireYear = String("0" + argins.CardExpireMonth).slice(-2);
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
