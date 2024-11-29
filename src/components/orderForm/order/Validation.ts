import * as Yup from "yup";

export const validationSchema = Yup.object({
  account: Yup.string()
    .required('Договор СДЕК обязателен'),
  recipient: Yup.object({
    name: Yup.string()
      .required("Имя получателя обязательно")
      .min(2, "Имя должно содержать минимум 2 символа")
      .matches(/^[а-яА-ЯёЁ\s-]+$/, "Используйте только русские буквы, пробел и дефис"),
    phones: Yup.array().of(
      Yup.object({
        number: Yup.string()
          .required("Номер телефона обязателен")
          .matches(
            /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
           
          )
      })
    )
  }),
  to_location: Yup.object({
    address: Yup.string()
      .required("Адрес обязателен")
      .min(5, "Адрес должен содержать минимум 5 символов"),
    city: Yup.string()
      .required("Город обязателен"),
    postal_code: Yup.string()
      .required("Почтовый индекс обязателен")
      .matches(/^\d{6}$/, "Почтовый индекс должен содержать 6 цифр")
  })
});