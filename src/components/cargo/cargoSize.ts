import { Box } from "./Validation";

export const getCargoSizeOptions = () => {
  const settingAccount = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const boxes = settingAccount?.boxesTypes || [];

  if (!boxes.length) {
    return [
      {
        value: "",
        label: "Нет доступных размеров",
      },
    ];
  }

  return boxes.map((box: Box) => ({
    value: `${box.length}x${box.width}x${box.height}`,
    label: `до ${box.maxWeight} кг ${box.length}x${box.width}x${box.height}`,
  }));
};
