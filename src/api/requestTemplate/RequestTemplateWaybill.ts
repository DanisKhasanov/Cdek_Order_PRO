export const RequestTemplateWaybill = (orderData: any) => {
  const { defaultDeclaredCost } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const defaultCost = defaultDeclaredCost || 0;
  const numberOfPackages = orderData.packages.length;
  const value = orderData.sum;
  const costPerPackage =
    numberOfPackages > 0 ? defaultCost / numberOfPackages : 0;
  const { fromLocation, orderType } = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  return {
    type: orderType,
    fromLocation: {
      code: fromLocation.code,
    },
    number: orderData.number,
    account: orderData.account,
    sender: {
      phones: orderData.sender.phones.map((phone: any) => ({
        number: phone.number,
      })),
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
      weight: pkg.weight * 1000,
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
      items: pkg.items.map((item: any) => ({
        name: item.name,
        wareKey: item.wareKey,
        marking: item.marking,
        weight: item.weight * 1000,
        amount: item.amount,
        payment:
          orderData.cod === true && index === 0
            ? { value: value }
            : { value: 0 },
        cost: costPerPackage,
      })),
    })),
    comment: orderData.commentDelivery,
    services: orderData.services,
    deliveryRecipientCost: orderData.deliveryRecipientCost,
  };
};
