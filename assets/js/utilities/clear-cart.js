
parasails.registerUtility('clearCart', async function clearCart() {
  if (localStorage && localStorage.getItem('cart')) {
    localStorage.removeItem('cart');
  }
  return {
    timePeriod: {},
    items: [],
  };
});
