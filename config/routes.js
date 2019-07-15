/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝
  'GET /':                   { action: 'view-homepage-or-redirect' },
  'GET /welcome':            { action: 'dashboard/view-welcome' },

  'GET /faq':                { view:   'pages/faq' },
  'GET /legal/terms':        { view:   'pages/legal/terms' },
  'GET /legal/privacy':      { view:   'pages/legal/privacy' },
  'GET /contact':            { view:   'pages/contact' },

  'GET /signup':             { action: 'entrance/view-signup' },
  'GET /email/confirm':      { action: 'entrance/confirm-email' },
  'GET /email/confirmed':    { view:   'pages/entrance/confirmed-email' },

  'GET /login':              { action: 'entrance/view-login' },
  'GET /password/forgot':    { action: 'entrance/view-forgot-password' },
  'GET /password/new':       { action: 'entrance/view-new-password' },

  'GET /account':            { action: 'account/view-account-overview' },
  'GET /account/password':   { action: 'account/view-edit-password' },
  'GET /account/profile':    { action: 'account/view-edit-profile' },

  'GET /rent/selection':     { action: 'rent/view-selection' },
  'GET /rent/cart':          { action: 'rent/view-cart' },
  'GET /rent/order-recovery':          { action: 'rent/view-order-recovery' },
  'GET /rent/member-orders':          { action: 'rent/view-member-orders' },

  'GET /checkout/reserve-prompt':   { action: 'checkout/view-reserve-prompt' },
  'GET /checkout/reserve-member':   { action: 'checkout/view-reserve-member' },
  'GET /checkout/reserve-guest':   { action: 'checkout/view-reserve-guest' },
  'GET /checkout/order-prompt':   { action: 'checkout/view-order-prompt' },
  'GET /checkout/purchase-guest':   { action: 'checkout/view-purchase-guest' },
  'GET /checkout/purchase-member':   { action: 'checkout/view-purchase-member' },
  'GET /checkout/order-confirmation':   { action: 'checkout/view-order-confirmation' },
  'GET /checkout/purchase-confirmation':   { action: 'checkout/view-purchase-confirmation' },


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
  // Note that, in this app, these API endpoints may be accessed using the `Cloud.*()` methods
  // from the CloudSDK library.
  '/api/v1/account/logout':                           { action: 'account/logout' },
  'PUT   /api/v1/account/update-password':            { action: 'account/update-password' },
  'PUT   /api/v1/account/update-profile':             { action: 'account/update-profile' },
  'PUT   /api/v1/account/update-billing-card':        { action: 'account/update-billing-card' },
  'PUT   /api/v1/entrance/login':                        { action: 'entrance/login' },
  'POST  /api/v1/entrance/signup':                       { action: 'entrance/signup' },
  'POST  /api/v1/entrance/send-password-recovery-email': { action: 'entrance/send-password-recovery-email' },
  'POST  /api/v1/entrance/update-password-and-login':    { action: 'entrance/update-password-and-login' },
  'POST  /api/v1/deliver-contact-form-message':          { action: 'deliver-contact-form-message' },
  'POST  /api/v1/glass/create-glass':          { action: 'glass/create-glass' },
  'GET   /api/v1/glass/get-glasses':          { action: 'glass/get-glasses' },
  'GET   /api/v1/glass/get-glass':          { action: 'glass/get-glass' },

  'POST  /api/v1/order/create-order':          { action: 'order/create-order' },
  'POST  /api/v1/order/create-guest-order':          { action: 'order/create-guest-order' },
  'GET   /api/v1/order/get-order':          { action: 'order/get-order' },
  'GET  /api/v1/order/get-orders':          { action: 'order/get-orders' },
  'GET  /api/v1/order/delete-order':          { action: 'order/delete-order' },
  'GET  /api/v1/order/update-order':          { action: 'order/update-order' },
  'GET   /api/v1/order/recover-reserved-order':          { action: 'order/recover-reserved-order' },
  'POST  /api/v1/order/create-reserve-order':          { action: 'order/create-reserve-order' },
  'POST  /api/v1/order/create-guest-order':          { action: 'order/create-guest-order' },
  'POST  /api/v1/order/create-member-reserve-order':          { action: 'order/create-member-reserve-order' },
  'POST  /api/v1/order/create-member-order':          { action: 'order/create-member-order' },

  'POST  /api/v1/cart/check-cart-item-valid':          { action: 'cart/check-cart-item-valid' },
  'POST  /api/v1/cart/check-cart-time-valid':          { action: 'cart/check-cart-time-valid' },
  'POST  /api/v1/cart/check-shipping-price':          { action: 'cart/check-shipping-price' },
  'POST  /api/v1/veritrans/charge':          { action: 'veritrans/charge' },

  'GET /api/v1/delivery/get-takuhai-time-slots':   { action: 'delivery/get-takuhai-time-slots' },
  'GET /api/v1/delivery/get-truck-distance-factor-costing':   { action: 'delivery/get-truck-distance-factor-costing' },


  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗  ╦═╗╔═╗╔╦╗╦╦═╗╔═╗╔═╗╔╦╗╔═╗
  //  ║║║║╚═╗║    ╠╦╝║╣  ║║║╠╦╝║╣ ║   ║ ╚═╗
  //  ╩ ╩╩╚═╝╚═╝  ╩╚═╚═╝═╩╝╩╩╚═╚═╝╚═╝ ╩ ╚═╝
  '/terms':                   '/legal/terms',
  '/logout':                  '/api/v1/account/logout',

};
