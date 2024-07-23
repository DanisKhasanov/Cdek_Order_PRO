import * as Yup from "yup";
import { CargoSize } from "../../../enum/CargoSize";

const validateWeightAndSize = (weight:number, size:any) => {
  if (size === CargoSize.SIZE_20X20X10 && weight > 2) {
    return false;
  } else if (size === CargoSize.SIZE_30X30X15 && (weight <= 2 || weight > 5)) {
    return false;
  } else if (size === CargoSize.SIZE_30X30X17 && (weight <= 5 || weight > 7)) {
    return false;
  } else if (size === CargoSize.SIZE_45X30X30 && weight < 7) {
    return false;
  }
  return true;
};

const initialValues = {
  weight: "",
  size: CargoSize.SIZE_20X20X10,
};

const validationSchema = Yup.object().shape({
  weight: Yup.number()
    .required("Введите вес")
    .test("weight-size-validation", "Вес не соответствует выбранному размеру коробки", function (value) {
      const { size } = this.parent;
      return validateWeightAndSize(value, size);
    }),
  size: Yup.string().required("Выберите размер коробки"),
});

export { initialValues, validationSchema };
