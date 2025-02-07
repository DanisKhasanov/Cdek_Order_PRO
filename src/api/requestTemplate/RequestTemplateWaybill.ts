export const RequestTemplateWaybill = (orderData: any) => {
  const COD = orderData.cod;
  return {
    type: 1,
    fromLocation: {
      code: orderData.fromLocation.code,
    },
    number: orderData.number,
    sender: {
      phones: [
        {
          number: "+79272441282",
        },
      ],
    },
    tariffCode: orderData.tariffCode,
    recipient: orderData.recipient,
    ...(orderData.toLocation && {
      toLocation: {
        code: orderData.toLocation.code,
        address: orderData.toLocation.address,
      },
    }),
    ...(orderData.deliveryPoint && {
      deliveryPoint: orderData.deliveryPoint,
    }),

    packages: orderData.packages.map((pkg: any, index: number) => ({
      number: pkg.number,
      weight: pkg.weight,
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
      items: pkg.items.map((item: any) => ({
        name: item.name,
        ware_key: item.ware_key,
        weight: item.weight,
        amount: item.amount,
        payment:
          COD === true
            ? {
                value: item.payment.value,
                vat_rate: 5.0,
              }
            : {
                value: 0,
              },
        cost: item.cost,
      })),
    })),
    comment: orderData.commentDelivery,
    services: orderData.services,
    deliveryRecipientCost: orderData.deliveryRecipientCost,
  };
};
