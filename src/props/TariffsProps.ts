export interface TariffProps {
  tariff_code: number;
  tariff_name: string;
  tariff_description: string;
  delivery_mode: number;
  delivery_sum: number;
  period_min: number;
  period_max: number;
}

export interface PickupPointProps {
  delivery?: any;
  rate?: any;
  address?: any;
  type?: string;
}
