
parasails.registerUtility('validateCart', async function convertOrderToCartSyntax(cartToValidate) {
  const cart = cartToValidate;
  // TODO: remove un required cart elements

  if (
    cart.timePeriod === undefined ||
    cart.items === undefined ||
    cart.shipping === undefined
  ) {
    toastr.error('Could not validate cart');
    return;
  }

  const payload = {
    timePeriod: cart.timePeriod,
    items: cart.items,
    shipping: cart.shipping,
    OrderIdToIgnore: cart.OrderIdToIgnore || undefined,
  }

  newCart = await Cloud.validateCart(..._.values(payload));
  // localStorage.setItem('cart', JSON.stringify(newCart));
  // this.newCart = newCart;
  return newCart;
});
