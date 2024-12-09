import { Box } from "./Validation";

export const getCargoSizeOptions = () => {
  const settingAccount = JSON.parse(
    localStorage.getItem("settingAccount") || "{}"
  );
  const boxes = settingAccount.boxes || [];

  return boxes.map((box: Box) => ({
    value: `${box.length}x${box.width}x${box.height}`,
    label: `до ${box.weight} кг ${box.length}x${box.width}x${box.height}`,
  }));
};
