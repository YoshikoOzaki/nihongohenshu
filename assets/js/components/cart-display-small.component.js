/**
 * <cart-display-small>
 * -----------------------------------------------------------------------------
 * A reusable that displays the cart
 *
 * @type {Component}
 *
 * @event cart-updated   [emitted when cart is reset]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('cartDisplaySmall', {
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
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div class="col-md-12">
      <h5>
        <span class="fa fa-shopping-cart mr-2 ml-2"></span>
        カート
      </h5>
      <div class="table-responsive">
        <table class="table table-sm">
          <tr>
            <th>
              Image
            </th>
            <th>
              Item
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
          <tr v-for="(item, index) in cart.items" :key="item.id">
            <td>
              <img style="height: 85px" :src="item.ImgSrc" />
            </td>
            <td>
              <div>
                {{item.NameJ1}}
              </div>
              <div>
                {{item.NameJ2}}
              </div>
            </td>
            <td>
              {{item.Quantity}}
            </td>
            <td>
              ¥{{item.UnitPrice}}
            </td>
            <td>
              ¥{{item.TotalPriceWithDiscountsAndWash.toLocaleString()}}
            </td>
            <td>
              <button
                @click=""
                type="submit"
                class="btn btn-sm btn-outline-secondary ajax-button"
              >
                <span class="button-text">
                  <i class="fa fa-trash mr-1"></i> Remove
                </span>
                <span class="button-loader clearfix">
                  <slot name="syncing-state">
                    <div class="loading-dot dot1"></div>
                    <div class="loading-dot dot2"></div>
                  </slot>
                </span>
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div class="row">
        <div class="col-md-12">
          <button class="btn btn-sm btn-outline-primary" @click="goToCart">
            <span id="cartNumber">
            </span>
            Go to カート
          </button>
        </div>
      </div>
    </div>
  `,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    //…
    this.taxRate = await Cloud.getConsumptionTaxRate();
  },
  mounted: async function(){
    //…
  },
  updated: async function() {
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    goToCart: async function() {
      window.location = '/rent/cart';
    },
  }
});
