export enum CargoSize {
    SIZE_20X20X10 = "20x20x10",
    SIZE_30X30X15 = "30x30x15",
    SIZE_45X30X17 = "45x30x17",
    SIZE_45X30X30 = "45x30x30",
  }
  
  export const CargoSizeOptions = [
    { value: CargoSize.SIZE_20X20X10, label: "до 2,7 кг 20х20х10" },
    { value: CargoSize.SIZE_30X30X15, label: "от 2,7-5 кг 30х30х15" },
    { value: CargoSize.SIZE_45X30X17, label: "от 5-7 кг 45х30х17" },
    { value: CargoSize.SIZE_45X30X30, label: "10 и более 45х30х30" },
  ];
  