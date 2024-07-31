export const RequestTemplateWaybill = (orderData: any) => {
  console.log('Количество packages:', orderData.packages.length);

  // Рассчитываем стоимость на один пакет
  const defaultCost = 100;
  const numberOfPackages = orderData.packages.length;
  const costPerPackage = numberOfPackages > 0 ? defaultCost / numberOfPackages : 0;

  return { 
      number: orderData.number,
      account: orderData.account,
      tariff_code: orderData.tariff_code,
      recipient: orderData.recipient,
      ...(orderData.to_location && {
        to_location: {
          code: orderData.to_location.code,
          address: orderData.to_location.address,
        },
      }),
      ...(orderData.delivery_point && {
        delivery_point: orderData.delivery_point,
      }),

      packages: orderData.packages.map((pkg: any) => ({
        number: pkg.number,
        weight: pkg.weight * 1000,
        length: pkg.length,
        width: pkg.width,
        height: pkg.height,
        items: pkg.items.map((item: any) => ({
          name: item.name,
          ware_key: item.ware_key,
          weight: item.weight * 1000,
          amount: item.amount,
          payment: {
            value: item.payment.value,
          },
          cost: costPerPackage,
        })),
      })),
      comment: orderData.comment_delivery,
      services: orderData.services,
  };
};
