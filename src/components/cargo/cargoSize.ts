import { Box } from "./Validation";

// Обновленный список коробок с размерами и максимальным весом
export const getCargoSizeOptions = () => {
  const settingAccount = [
    { length: 20, width: 20, height: 10, maxWeight: 5 },
    { length: 30, width: 30, height: 15, maxWeight: 10 },
    { length: 40, width: 40, height: 20, maxWeight: 20 },
    // Добавьте другие коробки по необходимости
  ];

  const boxes = settingAccount;

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
