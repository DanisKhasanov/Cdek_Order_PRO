import * as Yup from "yup";

export interface Box {
  weight: number;
  length: number;
  width: number;
  height: number;
}
const settingAccount = JSON.parse(
  localStorage.getItem("settingAccount") || "{}"
);
const validateWeightAndSize = (weight: number, size: string) => {
  const boxes = settingAccount.boxes;
  const [length, width, height] = size.split("x").map(Number);
  const matchingBox = boxes.find(
    (box: Box) =>
      box.length === length && box.width === width && box.height === height
  );

  if (!matchingBox) {
    return false;
  }

  return weight <= matchingBox.weight;
};

const getInitialValues = () => {
  const firstBox = settingAccount.boxes?.[0];

  return {
    weight: "",
    size: firstBox
      ? `${firstBox.length}x${firstBox.width}x${firstBox.height}`
      : "",
  };
};

const initialValues = getInitialValues();

const validationSchema = Yup.object().shape({
  weight: Yup.number()
    .required("Введите вес")
    .test(
      "weight-size-validation",
      "Вес не соответствует выбранному размеру коробки",
      function (value) {
        const { size } = this.parent;
        return validateWeightAndSize(value, size);
      }
    ),
  size: Yup.string().required("Выберите размер коробки"),
});

export { initialValues, validationSchema, validateWeightAndSize };
