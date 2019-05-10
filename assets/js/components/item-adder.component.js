/**
 * <item-adder>
 * -----------------------------------------------------------------------------
 *
 * @type {Component}
 *
 * @slot default                     [form contents]
 *
 * @event update:cloudError          [.sync]
 * @event update:syncing             [.sync]
 * @event update:formErrors          [.sync]
 * @event submitted                  [emitted after the server responds with a 2xx status code]
 * @event rejected                   [emitted after the server responds with a non-2xx status code]
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('itemAdder', {

  props: [
    'syncing',
    'cloudError',
    'product',
    'action',
    'index',
    'handle-submitting',
  ],

  data: function () {
    return {
      quantity: '',
    };
  },

  template: `
    <div
      class="row mb-3 p-3"
      style="border: 1px lightgray solid"
    >
      <div class="col-sm-6">
        <img width="230" :src="product.ImgSrc" />
      </div>
      <div class="col-sm-6">
        <div>{{ product.NameEng }}</div>
        <div>{{ product.NameJap }}</div>
        <small>Total Count: {{ product.TotalQuantityInSystem }}</small>
        <br />
        <small>Sku: {{ product.Sku }}</small>
        <br />
        <small>Id: {{ product.id }}</small>
        <br />
        <small>Regular Price: {{ product.UnitPrice }}</small>
        <br />
        <small>Product Code: {{ product.ProductCode }}</small>
        <input
          class="form-control"
          id="quantity"
          name="quantity"
          type="number"
          placeholder="0"
          autocomplete="quantity"
          v-model="quantity"
        />
        <button @click="submit" class="btn btn-primary btn-sm" :class="[syncing ? 'syncing' : '']">
          <span class="button-text" v-if="!syncing"><slot name="default">Submit</slot></span>
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
  `,

  mounted: async function (){
    console.log(this.product);
    console.log(this.index);
  },

  methods: {

    submit: async function () {
      console.log('submit ' + this.quantity + ' ' + this.product.id);
      if (this.syncing) {
        return;
      }

      this.$emit('update:cloudError', '');
      this.$emit('update:syncing', true);

      var failedWithCloudExit;
      var result;
      try {
        result = await this.handleSubmitting({
          Id: this.product.id,
          Quantity: this.quantity,
        })} catch (err) {
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

      this.$emit('update:syncing', false);
      if (failedWithCloudExit) {
        this.$emit('update:cloudError', failedWithCloudExit);
      }

    }
  },
})
