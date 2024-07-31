export const RequestTemplateCargo = (orderData: any) => ({
  to_location: {
    postal_code: orderData.to_location.postal_code,
    city: orderData.to_location.city,
  },
});
