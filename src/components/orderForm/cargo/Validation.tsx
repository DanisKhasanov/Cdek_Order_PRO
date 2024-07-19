import * as Yup from "yup";

const initialValues = {
  weight: "",
  size: "20х20х10",
};

const validationSchema = Yup.object().shape({
  weight: Yup.number().required("Введите вес"),
});


export { initialValues, validationSchema }