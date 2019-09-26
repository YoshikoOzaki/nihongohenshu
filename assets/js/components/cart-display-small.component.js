/**
 * <cart-display-small>
 * -----------------------------------------------------------------------------
 * A reusable that displays the cart
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('cartDisplaySmall', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'cart',
    'validateCart',
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
      <div class="container card pb-3">
        <div class="mt-2">
          <h5>
            <span class="fa fa-shopping-cart mr-2 ml-2"></span>
            カートの中身
          </h5>
        </div>
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
              <th>
              </th>
            </tr>
            <tr v-for="(item, index) in cart.items" :key="item.id">
              <td>
                <img style="height: 50px; max-width: 100%; margin: 0 auto; border: 1px gray solid;" :src="item.ImgSrc" />
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
                  @click="removeItemFromCart({ index: index })"
                  type="submit"
                  class="btn btn-sm btn-outline-secondary ajax-button"
                >
                  <span class="button-text">
                    <i class="fa fa-trash"></i>
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
    //
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

    removeItemFromCart: async function(data) {
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
    }
  }
});
