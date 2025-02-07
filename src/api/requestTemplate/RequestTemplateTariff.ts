export const RequestTemplateTariff = (orderData: any) => ({
  fromLocation: {
    code: orderData.fromLocation?.code,
    postalCode: (orderData.fromLocation?.postalCode).toString(),
  },
  type: 1,
  toLocation: {
    code: orderData.toLocation?.code,
  },
  packages: orderData.packages.map((packageItem: any) => ({
    weight: packageItem.weight,
    length: packageItem.length,
    width: packageItem.width,
    height: packageItem.height,
  })),
});
