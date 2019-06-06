parasails.registerPage('member-orders', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    moment: moment,
    orders: {},
    selectedOrders: [],
    ordersWithFullData: [],
    syncing: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    moment.locale("ja");
    console.log(parasails);
  },
  mounted: async function() {
    //…
    const payload = {
      UserId: this.me.id,
    }
    console.log(payload);
    console.log(..._.values(payload));
    this.orders = await Cloud.getOrders(
      ..._.values(payload)
    );

    await console.log(this.orders);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    toggleAddToSelectedOrders: async function(orderId) {
      if (!_.includes(this.selectedOrders, orderId)) {
        this.selectedOrders.push(orderId);
        const order = await Cloud.getOrder(orderId);
        this.ordersWithFullData[orderId] = order;
        await this.$forceUpdate();
        return;
      }
      const currentOrders = this.selectedOrders;
      this.selectedOrders = _.without(currentOrders, orderId);
    },

    addOrderToCart: async function(order) {
      const cartReadyOrder = await parasails.util.convertOrderToCartSyntax(order);
      await console.log(cartReadyOrder);
    }
  }
});
