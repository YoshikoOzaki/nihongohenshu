/**
 * <wine-scale>
 * -----------------------------------------------------------------------------
 * Wine Scale
 *
 * @type {Component}
 *
 * -----------------------------------------------------------------------------
 */

parasails.registerComponent('wineScale', {
  //  ╔═╗╦═╗╔═╗╔═╗╔═╗
  //  ╠═╝╠╦╝║ ║╠═╝╚═╗
  //  ╩  ╩╚═╚═╝╩  ╚═╝
  props: [
    'scaleData'
  ],

  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: function (){
    return {
      //…
    };
  },

  //  ╦ ╦╔╦╗╔╦╗╦
  //  ╠═╣ ║ ║║║║
  //  ╩ ╩ ╩ ╩ ╩╩═╝
  template: `
    <div class="text-left">
      <small>(お薦めの用途)</small>
      <div id="white" style="border: 1px grey solid; display: flex" class="mb-2">
        <div class="px-1">
          <small>白</small>
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.white, 1) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.white, 2) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.white, 3) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:style="{ 'bg-dark': (_.indexOf(scaleData.white, 4) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.white, 5) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
      </div>
      <div id="white" style="border: 1px grey solid; display: flex" class="mb-2">
        <div class="px-1">
          <small>赤</small>
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.red, 1) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.red, 2) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.red, 3) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.red, 4) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
        <div v-bind:class="{ 'bg-dark': (_.indexOf(scaleData.red, 5) !== -1) }" style="border-left: white 1px solid; background-color: lightgrey; width: 20%">
        </div>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div style="padding-left: 25px">
          ﾗｲﾄ
        </div>
        <div>
          ﾌﾙ
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
    console.log(_.indexOf(this.scaleData.white, 4));
    // console.log(this.scaleData.white);
  },
  beforeDestroy: function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

  }
});
