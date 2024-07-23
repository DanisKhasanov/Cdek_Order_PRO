import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Package {
  height: number;
  length: number;
  width: number;
  weight: number;
}

interface OrderFormState {
  number: string;
  recipient: {
    name: string;
    phones: { number: string }[];
  };
  to_location: {
    code: number;
    city: string;
    address: string;
  };
  packages: Package[];
  comment: string;
  delivery_point: string; // код до какого ПВЗ или постамата
  shipment_point: string; // код с какого ПВЗ
  tariff_code: number; // код тарифа 
  cod: boolean;
  sum: number;
}

const initialState: OrderFormState = {
  number: "",
  recipient: {
    name: "",
    phones: [{ number: "" }],
  },
  to_location: {
    code: 0,
    city: "",
    address: "",
  },
  packages: [],
  comment: "",
  delivery_point: "",
  shipment_point: "",
  tariff_code: 0,
  cod: false,
  sum: 0,
};

const orderFormSlice = createSlice({
  name: "orderForm",
  initialState,
  reducers: {
    updateOrderForm: (
      state,
      action: PayloadAction<Partial<OrderFormState>>
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    addCargoSpace: (
      state,
      action: PayloadAction<{ index: number; weight: number; size: string }>
    ) => {
      const { weight, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);
      state.packages.push({ weight, length, width, height });
    },
    removeCargoSpace: (state, action: PayloadAction<number>) => {
      state.packages = state.packages.filter(
        (_, index) => index !== action.payload
      );
    },
    editCargoSpace: (
      state,
      action: PayloadAction<{ index: number; weight: number; size: string }>
    ) => {
      const { index, weight, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);
      if (state.packages[index]) {
        state.packages[index] = { weight, length, width, height };
      }
    },
    copyCargoSpace: (state, action: PayloadAction<number>) => {
      const packageToCopy = state.packages[action.payload];
      if (packageToCopy) {
        state.packages.push({ ...packageToCopy });
      }
    },
  },
});

export const {
  updateOrderForm,
  addCargoSpace,
  removeCargoSpace,
  editCargoSpace,
  copyCargoSpace,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
