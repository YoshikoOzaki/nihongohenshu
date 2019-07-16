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
      subTotal: '',
      taxTotal: '',
      grandTotal: '',
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
      <div class="">
                    <h6>Shipping</h6>
                  </div>
                  <div class="table-responsive" v-if="cart.shipping || cart.timePeriod">
                    <table class="table table-bordered table-sm">
                      <thead class="thead">
                        <th>
                          Delivery Date
                        </th>
                        <th>
                          Return Date
                        </th>
                        <th>
                          Days Used
                        </th>
                        <th>
                          Postcode
                        </th>
                        <th>
                          Shipping Method
                        </th>
                        <th>
                          Area
                        </th>
                        <th>
                          Shipping
                        </th>
                        <th>
                          Tax
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
                          {{cart.shipping && cart.shipping.postcodeRaw || "Add a Postcode"}}<br />
                          <small
                            class="text-info">{{ (cart.shipping && cart.shipping.shippingPossible === false) ? "Shipping Not Possible" : ""}}</small>
                        </td>
                        <td>
                          {{cart.shipping && _.capitalize(cart.shipping.shippingType)}}<br />
                        </td>
                        <td>
                          {{cart.shipping && cart.shipping.shippingFactorRecord && _.capitalize(cart.shipping.shippingFactorRecord.Place)}}<br />
                        </td>
                        <td>
                          ¥{{cart.shipping && cart.shipping.price || 0}}
                        </td>
                        <td>
                          ¥{{cart.shipping && cart.shipping.consumptionTax || 0}}
                        </td>
                        <td>
                          ¥{{cart.shipping && cart.shipping.priceWithTax || 0}}
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div class="" v-if="subTotal && taxTotal && grandTotal">
                    <div class="" v-if="subTotal && taxTotal && grandTotal">
                      <h6>Totals</h6>
                    </div>
                    <div class="text-right">
                      <h5>Sub Total</h5>
                      <b>¥ {{subTotal && subTotal.toLocaleString()}}</b>
                      <hr />
                      <h5>Tax Total</h5>
                      <b>¥ {{taxTotal && taxTotal.toLocaleString()}}</b>
                      <hr />
                      <h4>Grand Total</h4>
                      <h5><b>¥ {{grandTotal && grandTotal.toLocaleString()}}</b></h5>
                      <hr />
                    </div>
                  </div>
      <div class="table-responsive">
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
  updated: async function() {
    const cart = this.cart;

    this.subTotal = ((_.sum(cart.items, (o) => { return o.DiscountedTotalPrice }) + cart.shipping.price) || 0);
    this.taxTotal = (_.sum(cart.items, (o) => { return o.ConsumptionTax }) + cart.shipping.consumptionTax);
    this.grandTotal = (this.subTotal + this.taxTotal);
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
            Id: item.id,
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
