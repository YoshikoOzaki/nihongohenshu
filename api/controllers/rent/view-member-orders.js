module.exports = {


  friendlyName: 'View member orders',


  description: 'Display "Member orders" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/rent/member-orders'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
