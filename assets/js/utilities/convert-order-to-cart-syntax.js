
parasails.registerUtility('convertOrderToCartSyntax', async function convertOrderToCartSyntax(recoveredOrder) {
  // should check all items, add the time, check shipping and add to cart
  // also start syncing here
  const newCartItems = [];
  // check all items - need to exclude this order
  if (recoveredOrder.OrderLineNumbers && recoveredOrder.OrderLineNumbers.length > 0) {
    // might need to add a price override here - price should be what it was reserved at
    // also need to not include any order lines that are from this order
    const checkCartItemAvailable = async function(orderLineNumber) {
      const payload = {
        Id: orderLineNumber.Product,
        Quantity: orderLineNumber.Quantity,
        DateStart: recoveredOrder.DateStart,
        DateEnd: recoveredOrder.DateEnd,
        DaysOfUse: recoveredOrder.DaysOfUse,
        OrderIdToIgnore: recoveredOrder.id,
      }
      if (orderLineNumber.Product !== null) {
        result = await Cloud.checkCartItemValid(..._.values(payload));
        return result;
      }
    };
    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }
    await asyncForEach(recoveredOrder.OrderLineNumbers, async (o) => {
      if (o.Product !== null) {
        const result = await checkCartItemAvailable(o);
        newCartItems.push(result);
      }
    });
  }
  // Add the time period
  const newCartTimePeriod = await Cloud.checkCartTimeValid(..._.values({
    DateStart: recoveredOrder.DateStart,
    DateEnd: recoveredOrder.DateEnd,
    DaysOfUse: recoveredOrder.DaysOfUse,
  }));

  // Add the shipping details
  // Check the shipping
  const shippingTransactionLine = _.find(recoveredOrder.OrderLineNumbers, { 'Product': null });

  const newCartShipping = {
    postcode: recoveredOrder.Postcode,
    price: shippingTransactionLine.UnitPrice * shippingTransactionLine.Quantity,
  }

  const newCart = {
    items: [ ...newCartItems ],
    shipping: {
      ...newCartShipping,
    },
    timePeriod: {
      ...newCartTimePeriod,
    },
    orderIdToIgnore: recoveredOrder.id,
    reserveOrderKeyword: recoveredOrder.CustomerKeyword,
  };
  // this.newCart = newCart;
  // then check shipping is possible with the new cart
  return newCart;
});
