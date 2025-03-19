export const getCargoSizeOptions = () => {
  const boxes = [
    { length: 20, width: 20, height: 10, maxWeight: 2.7 },
    { length: 30, width: 30, height: 15, maxWeight: 5 },
    { length: 45, width: 30, height: 17, maxWeight: 7 },
    { length: 45, width: 30, height: 30, maxWeight: 15 },
  ];

  if (!boxes.length) {
    return [{ label: "Нет доступных размеров", value: "", length: 0, width: 0, height: 0 }];
  }

  return boxes.map((box) => ({
    value: `${box.length}x${box.width}x${box.height}`,
    label: `до ${box.maxWeight} кг ${box.length}x${box.width}x${box.height}`,
    length: box.length,
    width: box.width,
    height: box.height,
  }));
};
