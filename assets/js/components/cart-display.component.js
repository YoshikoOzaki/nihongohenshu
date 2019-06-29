/**
 * <cart-display>
 * -----------------------------------------------------------------------------
 * A reusable that displays the cart
 *
 * @type {Component}
 *
 * @event cart-updated   [emitted when cart is reset]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('cartDisplay', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'cart',
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      moment: moment,
      syncMessage: '',
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
  <div>
    <div class="row">
    <div class="col-md-12">
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <tr>
            <th>
              Image
            </th>
            <th>
              Item
            </th>
            <th>
              Available
            </th>
            <th>
              Quantity
            </th>
            <th>
              Price
            </th>
            <th>
              Total
            </th>
          </tr>
          <tr v-for="(item, index) in cart.items" :key="item.Id">
            <td>
              <img style="height: 85px" :src="item.ImgSrc" />
            </td>
            <td>
              {{item.NameEng}}
            </td>
            <td>
              <div class="text-success" v-bind:class="{ 'text-danger': item.Available.available === 'Not Available' }">
                <div v-if="item.Available !== 'No date set to evaluate'">
                  {{item.Available.available}}&nbsp;<br />
                  <span class="text-muted" v-if="item.Available.available === 'Not Available'">{{item.Available.remaining}} In Stock</span>
                </div>
                <div class="text-warning" v-if="item.Available === 'No date set to evaluate'">
                  {{item.Available}}
                </div>
              </div>
            </td>
            <td>
              {{item.Quantity}}
            </td>
            <td>
              ¥{{item.UnitPrice}}
            </td>
            <td>
              ¥{{item.DiscountedTotalPrice}}
            </td>
          </tr>
        </table>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead class="thead-dark">
            <th>
              Pick Up Date
            </th>
            <th>
              Return Date
            </th>
            <th>
              Days of Use
            </th>
            <th>
              Postcode
            </th>
            <th>
              Shipping
            </th>
            <th>
              Total
            </th>
          </thead>
          <tr>
            <td>
              {{cart.timePeriod && moment(cart.timePeriod.DateStart).format('LL') || "None"}}
            </td>
            <td>
              {{cart.timePeriod && moment(cart.timePeriod.DateEnd).format('LL') || "None"}}
            </td>
            <td>
              {{cart.timePeriod && cart.timePeriod.DaysOfUse || "None"}}
            </td>
            <td>
              {{cart.shipping && cart.shipping.postcode || "Add a Postcode"}}<br />
              <small class="text-danger">{{ (cart.shipping && cart.shipping.shippingPossible === false) ? "Shipping Not Possible" : ""}}</small>
            </td>
            <td>
              ¥{{cart.shipping && cart.shipping.price || 0}}
            </td>
            <td>
              <b>¥{{cart.shipping && (_.sum(cart.items, (o) => { return o.DiscountedTotalPrice }) + cart.shipping.price) || 0 }}</b>
            </td>
          </tr>
        </table>
        <button
          @click="checkAllCartAvailability"
          class="btn btn-outline-secondary btn-sm"
        >
          <span class="fa fa-refresh"></span>
          Refresh Cart Items
        </button>
        <div class="mt-2" v-if="syncMessage !== ''">
          {{syncMessage}}
        </div>
      </div>
    </div>
    </div>
  </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    //…
  },
  mounted: async function(){
    //…
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    asyncForEach: async function(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    },

    checkAllCartAvailability: async function() {
      const newCartItems = [];
      const cart = await parasails.util.getCart();
      this.syncMessage = "Checking Cart Items... " + "0/" + cart.items.length;
      if (cart.items && cart.items.length > 0) {
        const checkCartItemAvailable = async function(item) {
          const dataWithTimePeriod = {
            Id: item.Id,
            Quantity: item.Quantity,
            ...cart.timePeriod,
            OrderIdToIgnore: cart.orderIdToIgnore,
          }
          // TODO: need to add order to ignore if it exists so it doesn't double check items
          result = await Cloud.checkCartItemValid(..._.values(dataWithTimePeriod));
          return result;
        };
        await this.asyncForEach(cart.items, async (o, i) => {
          this.syncMessage = "Checking Cart Items... " + (i+1) +"/" + cart.items.length;
          const result = await checkCartItemAvailable(o);
          newCartItems.push(result);
        });
      }
      if (_.isEqual(newCartItems, cart.items)) {
        this.syncMessage = "";
        toastr.success('Cart remains the same');
        return
      }

      const newCart = {
        ...cart,
        items: newCartItems,
      };
      await localStorage.setItem('cart', JSON.stringify(newCart));
      this.$emit('cart-updated');
      toastr.success('Cart has been updated');
      this.syncMessage = "";
    },
  }
});
