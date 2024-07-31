
export const RequestTemplateTariff = (orderData: any) => ({
  to_location: {
    code: orderData.to_location?.code,
  },
  packages: orderData.packages.map((packageItem: any) => ({
    weight: packageItem.weight * 1000,
    length: packageItem.length,
    width: packageItem.width,
    height: packageItem.height,
  })),
});