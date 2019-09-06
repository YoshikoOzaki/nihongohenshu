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
      <div class="mb-3">
        <img
          :src="product.ImgSrc"
          style="max-height: 218px; cursor: pointer; margin: 0 auto; border: 1px #4C3778 solid"
          @click="clickProductImage"
        />
      </div>
      <div>
        <div class="mb-1 text-center">
          <h5>{{ product.NameJ1 }}</h5>
          <div>{{ product.NameJ2 }}</div>
        </div>
        <div class="row mb-3">
          <div class="col-md-7">
            <wine-scale />
          </div>
          <div class="col-md-5 pr-4" style="padding-top: 20px;">
            <div>
              1日最大使用料
            </div>
            <div class="text-center">
              <h5>￥{{ product.UnitPrice }}/ 脚</h5>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-5 offset-md-1">
            <input
              class="form-control form-control-sm mb-1"
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
          </div>
          <div class="col-md-5">
            <button @click="submit" type="submit" class="btn btn-sm btn-block btn-primary ajax-button" :class="[syncing ? 'syncing' : '']">
              <span class="button-text" v-if="!syncing"><slot name="default">カートに入れる</slot></span>
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
        </div>
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
            {{ product.NameE1 }}
            {{ product.NameJ1 }}
          </h5>
        </div>
        <div class="modal-body">
          <div class="">
            <img
              width="100%"
              :src="product.ImgSrc"
              @click="clickProductImage"
            />
            <h6>{{ product.NameE1 }}</h6>
            <h6>{{ product.NameJ1 }}</h6>
            <div>{{ product.NameE2 }}</div>
            <div>{{ product.NameJ2 }}</div>
            <br />
            <small>Sku: {{ product.id }}</small>
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
