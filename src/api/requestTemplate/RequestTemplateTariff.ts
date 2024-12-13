const { fromLocation, orderType } = JSON.parse(
  localStorage.getItem("settingAccount") || "{}"
);

export const RequestTemplateTariff = (orderData: any) => ({
  fromLocation: {
    code: fromLocation.code,
  },
  type: orderType,
  toLocation: {
    code: orderData.toLocation?.code,
  },
  packages: orderData.packages.map((packageItem: any) => ({
    weight: packageItem.weight * 1000,
    length: packageItem.length,
    width: packageItem.width,
    height: packageItem.height,
  })),
});
