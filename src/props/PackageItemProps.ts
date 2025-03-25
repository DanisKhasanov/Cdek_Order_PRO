export interface PackageItem {
    name: string;
    ware_key: string;
    weight: number;
    amount: number;
    payment: {
      value: number;
    };
    cost: number;
  }