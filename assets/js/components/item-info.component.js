/**
 * <item-info>
 * -----------------------------------------------------------------------------
 *
 * @type {Component}
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('itemInfo', {

  props: [
    'item',
    'glasses',
  ],

  data: function () {
    return {
      product: _.find(this.glasses, (o) => { return o.id = this.item.Product }),
    };
  },

  template: `
    <div class="row">
      <div class="col-md-12">
        <img width="230" :src="product.ImgSrc" />
      </div>
      <div class="col-md-12">
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
      </div>
    </div>
  `,

  mounted: async function (){
    console.log(_.find(this.glasses, (o) => { return o.id = this.item.Glass }));
  },

  methods: {
  },
})
