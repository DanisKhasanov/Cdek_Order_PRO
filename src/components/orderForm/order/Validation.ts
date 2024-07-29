import * as Yup from "yup";

export const validationSchema = Yup.object({
  recipient: Yup.object({
    name: Yup.string().required("Имя получателя обязательно"),
    phones: Yup.array().of(
      Yup.object({
        number: Yup.string().required("Номер телефона обязателен"),
      })
    ),
  }),
  to_location: Yup.object({
    address: Yup.string().required("Адрес обязателен"),
  }),
});
