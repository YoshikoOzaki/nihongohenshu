
parasails.registerUtility('validateCart', async function convertOrderToCartSyntax(cartToValidate) {
  console.log('validateCart');
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

  try {
    newCart = await Cloud.validateCart(..._.values(payload));
  } catch (err) {
    console.log(err);
    return;
  }
  // localStorage.setItem('cart', JSON.stringify(newCart));
  // this.newCart = newCart;
  console.log('cart validated...');
  console.log(newCart);
  return newCart;
});
