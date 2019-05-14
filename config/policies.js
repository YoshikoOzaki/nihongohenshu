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
  'view-homepage-or-redirect': true,
  'deliver-contact-form-message': true,
  'cart/check-cart-item-valid': true,
  'cart/check-cart-time-valid': true,
  'cart/check-shipping-price': true,
  'glass/get-glasses': true,
  'rent/view-selection': true,
  'rent/view-cart': true,
  'checkout/view-reserve-prompt': true,
  'checkout/view-reserve-guest': true,
  'order/view-order-confirmation': true,
  'order/create-reserve-order': true,
};
