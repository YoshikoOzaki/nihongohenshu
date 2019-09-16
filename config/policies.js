/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'entrance/*': true,
  'account/logout': true,
  'view-about': true,
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,

  'cart/check-cart-item-valid': true,
  'cart/check-cart-time-valid': true,
  'cart/check-shipping-price': true,
  'cart/validate-cart': true,

  'glass/get-glasses': true,
  'glass/get-glass': true,

  'rent/view-selection': true,
  'rent/view-cart': true,
  'rent/view-order-recovery': true,

  'checkout/view-reserve-prompt': true,
  'checkout/view-reserve-guest': true,
  'checkout/view-order-confirmation': true,
  'checkout/view-purchase-confirmation': true,
  'checkout/view-order-prompt': true,
  'checkout/view-purchase-guest': true,

  'order/create-reserve-order': true,
  'order/create-guest-order': true,
  'order/get-order': true,
  'order/recover-reserved-order': true,
  'order/delete-order': true,
  'order/get-consumption-tax-rate': true,

  'veritrans/charge' : true,

  'delivery/get-takuhai-time-slots' : true,
  'delivery/get-truck-distance-factor-costing' : true,
};
