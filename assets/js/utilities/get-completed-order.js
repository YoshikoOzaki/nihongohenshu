
parasails.registerUtility('getCompletedOrder', async function getCompletedOrder() {
  if (localStorage && localStorage.getItem('completedOrder')) {
    return JSON.parse(localStorage.getItem('completedOrder'));
  }
  return {
    completedOrder: {},
  };
});
