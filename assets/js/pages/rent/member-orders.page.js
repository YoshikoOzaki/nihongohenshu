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
  },
  mounted: async function() {
    //…
    const payload = {
      UserId: this.me.id,
    }
    this.orders = await Cloud.getOrders(
      ..._.values(payload)
    );
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    //…
    toggleAddToSelectedOrders: async function(orderId) {
      if (!_.includes(this.selectedOrders, orderId)) {
        this.selectedOrders = [];
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
      this.syncing = true;
      try {
        const cartReadyOrder = await parasails.util.convertOrderToCartSyntax(order);
        await localStorage.setItem('cart', JSON.stringify(cartReadyOrder));
        toastr.success('Added reserved order to the cart');
      } catch (err) {
        toastr.error('Could not add order to cart');
      }
      this.syncing = false;
    },

    deleteReservedOrder: async function(orderId) {
      try {
        await Cloud.deleteOrder(Number(orderId));
        this.orders = await Cloud.getOrders(this.me.id);
        toastr.success('Deleted Reserve Order');
      } catch (err) {
        toastr.error('Could not delete reserve order');
      }
    }
  }
});
