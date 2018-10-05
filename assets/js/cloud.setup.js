/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"createGlass":{"verb":"POST","url":"/api/v1/glass/create-glass","args":["Name","TotalQuantityInSystem","ImgSrc","Sku"]},"getGlasses":{"verb":"GET","url":"/api/v1/glass/get-glasses","args":[]},"createOrder":{"verb":"POST","url":"/api/v1/order/create-order","args":["DateStart","DateEnd","DaysOfUse","Items"]},"checkCartItemValid":{"verb":"POST","url":"/api/v1/cart/check-cart-item-valid","args":["Id","Quantity"]},"checkCartTimeValid":{"verb":"POST","url":"/api/v1/cart/check-cart-time-valid","args":["DateStart","DateEnd","DaysOfUse"]}}
  /* eslint-enable */

});
