import * as Yup from "yup";

export interface Box {
  maxWeight: number;
  length: number;
  width: number;
  height: number;
}
const settingAccount = JSON.parse(
  localStorage.getItem("settingAccount") || "{}"
);
const validateWeightAndSize = (weight: number, size: string) => {
  const boxes = settingAccount?.boxesTypes || [];
  if (!size) return false;

  const [length, width, height] = size.split("x").map(Number);
  const matchingBox = boxes.find(
    (box: Box) =>
      box.length === length && box.width === width && box.height === height
  );

  if (!matchingBox) {
    return false;
  }

 const sortedBoxes = boxes.sort((a: Box, b: Box) => a.maxWeight - b.maxWeight);
 const currentBoxIndex = sortedBoxes.findIndex(
   (box: Box) => box.maxWeight === matchingBox.maxWeight
 );
 const prevBox = currentBoxIndex > 0 ? sortedBoxes[currentBoxIndex - 1] : null;

 const minWeight = prevBox ? prevBox.maxWeight / 1000 : 0;
 const maxWeight = matchingBox.maxWeight / 1000;

 return weight > minWeight && weight <= maxWeight;
};

const getInitialValues = () => {
  const firstBox = settingAccount.boxesTypes?.[0];

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
    .required(" ")
    .test(
      "weight-size-validation",
      function(value) {
        const { size } = this.parent;
        if (!size) {
          return true; 
        }
        const boxes = settingAccount?.boxesTypes || [];
        const [length, width, height] = size.split("x").map(Number);
        const matchingBox = boxes.find(
          (box: Box) =>
            box.length === length && box.width === width && box.height === height
        );
        
        if (matchingBox) {
          const sortedBoxes = boxes.sort((a: Box, b: Box) => a.maxWeight - b.maxWeight);
          const currentBoxIndex = sortedBoxes.findIndex(
            (box: Box) => box.maxWeight === matchingBox.maxWeight
          );
          const prevBox = currentBoxIndex > 0 ? sortedBoxes[currentBoxIndex - 1] : null;
          const minWeight = prevBox ? prevBox.maxWeight / 1000 : 0;
          
          if (value <= minWeight) {
            return this.createError({
              message: `Вес должен быть больше ${minWeight} кг для этой коробки`
            });
          }
          if (value > matchingBox.maxWeight / 1000) {
            return this.createError({
              message: `Вес не должен превышать ${matchingBox.maxWeight / 1000} кг`
            });
          }
        }
        return true;
      }
    ),
  size: Yup.string().required("Выберите размер коробки"),
});

export { initialValues, validationSchema, validateWeightAndSize };
