export interface PackageItem {
  id: string;
  name: string;
  ware_key: string;
  weight: number;
  amount: number;
  payment: {
    value: number;
  };
  cost: number;
}
