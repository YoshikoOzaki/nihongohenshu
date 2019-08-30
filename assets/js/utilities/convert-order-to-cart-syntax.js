
parasails.registerUtility('convertOrderToCartSyntax', async function convertOrderToCartSyntax(recoveredOrder) {
    const filteredOrderLines = _.filter(recoveredOrder.OrderLineNumbers, (o) => {
      const productIsDelivery = o.Product === 160 || o.Product === null;
      return !productIsDelivery;
    });

    const convertedOrder = {
      timePeriod: {
        DateStart: recoveredOrder.DateStart,
        DateEnd: recoveredOrder.DateEnd,
        DaysOfUse: recoveredOrder.DaysOfUse,
      },
      items: [
        ..._.map(filteredOrderLines, (o) => {
          return {
            id: o.Product,
            Quantity: o.Quantity,
          }
        })
      ],
      shipping: {
        Postcode: recoveredOrder.Postcode,
        PostcodeRaw: recoveredOrder.PostcodeRaw,
      },
      OrderIdToIgnore: recoveredOrder.id,
    };

    return convertedOrder;
});
