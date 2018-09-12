
parasails.registerUtility('getCart', async function getCart() {
  if (localStorage && localStorage.getItem('cart')) {
    return JSON.parse(localStorage.getItem('cart'));
  }
  return {
    timePeriod: {},
    items: [],
  };
});
