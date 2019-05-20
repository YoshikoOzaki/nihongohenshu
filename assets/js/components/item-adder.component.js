/**
 * <item-adder>
 * -----------------------------------------------------------------------------
 *
 * @type {Component}
 *
 * @slot default                     [form contents]
 *
 * @event update:cloudError          [.sync]
 * @event update:formErrors          [.sync]
 * @event submitted                  [emitted after the server responds with a 2xx status code]
 * @event rejected                   [emitted after the server responds with a non-2xx status code]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('itemAdder', {

  props: [
    'cloudError',
    'product',
    'action',
    'index',
    'handle-submitting',
    'syncing',
  ],

  data: function () {
    return {
      quantity: '',
      productModalVisable: false,
      formErrors: {},
    };
  },

  template: `
    <div>
      <div class="col-md-12">
        <img
          width="100%"
          :src="product.ImgSrc"
          style="cursor: pointer"
          @click="clickProductImage"
        />
      </div>
      <div class="col-md-12 text-center">
        <div class="mb-3">
          <h6 class="text-center">Plumm</h6>
          <div>{{ product.NameEng }}</div>
          <small>¥{{ product.UnitPrice }}</small>
        </div>
        <input
          class="form-control mb-3"
          id="quantity"
          name="quantity"
          type="number"
          placeholder="0"
          autocomplete="quantity"
          v-model="quantity"
          :class="[formErrors.Quantity ? 'is-invalid' : '']"
        />
        <div
          class="invalid-feedback"
          v-if="formErrors.Quantity"
          style="margin-top: -15px; margin-bottom: 5px;"
        >
          Please enter a valid quantity.
        </div>
        <button @click="submit" type="submit" class="btn btn-block btn-outline-primary ajax-button" :class="[syncing ? 'syncing' : '']">
          <span class="button-text" v-if="!syncing"><slot name="default">Add to Cart</slot></span>
          <span class="button-loader clearfix" v-if="syncing">
            <slot name="syncing-state">
              <div class="loading-dot dot1"></div>
              <div class="loading-dot dot2"></div>
              <div class="loading-dot dot3"></div>
              <div class="loading-dot dot4"></div>
            </slot>
          </span>
        </button>
      </div>
      <modal
        v-if="productModalVisable"
        @close="closeProductModal()"
        v-cloak
      >
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span>&times;</span>
          </button>
          <h5 class="modal-title">
            {{ product.NameEng }}
          </h5>
        </div>
        <div class="modal-body">
          <div class="">
            <img
              width="100%"
              :src="product.ImgSrc"
              @click="clickProductImage"
            />
            <h6>Plumm</h6>
            <div>{{ product.NameEng }}</div>
            <div>{{ product.NameJap }}</div>
            <small>Total Count: {{ product.TotalQuantityInSystem }}</small>
            <br />
            <small>Sku: {{ product.Sku }}</small>
            <br />
            <small>Id: {{ product.id }}</small>
            <br />
            <small>¥{{ product.UnitPrice }}</small>
          </div>
        </div>
      </modal>
    </div>
  `,

  mounted: async function (){
    // console.log(this.product);
    // console.log(this.index);
  },

  methods: {

    clickProductImage: async function() {
      this.productModalVisable = true;
    },

    closeProductModal: async function() {
      this.productModalVisable = false;
      this.cloudError = false;
    },

    submit: async function () {
      if (this.syncing) {
        return;
      }

      // handle parsing
      this.formErrors = {};
      if (!this.quantity) {
        this.formErrors.Quantity = true;
      }
      if (this.quantity === '' || this.quantity === 0) {
        this.formErrors.Quantity = true;
      }
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      this.$emit('update:cloudError', '');

      var failedWithCloudExit;
      var result;
      try {
        result = await this.handleSubmitting({
          Id: this.product.id,
          Quantity: this.quantity,
        })
      } catch (err) {
        rawErrorFromCloudSDK = err;
        if (_.isString(err)) {
          failedWithCloudExit = err || 'error';
        } else if (_.isError(err)) {
          failedWithCloudExit = err.exit || 'error';
        } else if (_.isObject(err)) {
          failedWithCloudExit = Object.keys(err)[0] || 'error';
        } else {
          throw err;
        }
      }

      if (failedWithCloudExit) {
        this.$emit('update:cloudError', failedWithCloudExit);
      }

      if (!failedWithCloudExit) {
        this.$emit('submitted', result);
      } else {
        this.$emit('rejected', rawErrorFromCloudSDK);
      }
    }
  },
})
