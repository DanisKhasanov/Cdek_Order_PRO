import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PackageItem {
  name: string;
  ware_key: string;
  weight: number;
  amount: number;
  payment: {
    value: number;
  };
  cost: number;
}
interface Package {
  number: string;
  height: number;
  length: number;
  width: number;
  weight: number;
  items: PackageItem[];
}

interface OrderFormState {
  number: string;
  recipient: {
    name: string;
    phones: [{ number: string }];
  };
  to_location: {
    code: number;
    city: string;
    postal_code: string;
    address: string;
  };
  packages: Package[];
  comment: string;
  delivery_point: string;
  delivery_point_address: any;
  tariff_code: number;
  services: { code: string; parameter: string }[] | [];
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
    postal_code: "",
    address: "",
  },
  packages: [],
  comment: "",
  delivery_point: "",
  delivery_point_address: {},
  tariff_code: 0,
  services: [],
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
      action: PayloadAction<{
        index: number;
        weight: number;
        size: string;
        items: PackageItem;
      }>
    ) => {
      const number = (state.packages.length + 1).toString();
      const { weight, size, items } = action.payload;
      const [length, width, height] = size.split("x").map(Number);
      state.packages.push({
        number,
        weight,
        length,
        width,
        height,
        items: [items],
      });
    },
    removeCargoSpace: (state, action: PayloadAction<number>) => {
      state.packages = state.packages.filter(
        (_, index) => index !== action.payload
      );
    },
    editCargoSpace: (
      state,
      action: PayloadAction<{
        index: number;
        weight: number;
        size: string;
        items: PackageItem;
      }>
    ) => {
      const number = state.packages.length.toString();
      const { index, weight, size, items } = action.payload;
      const [length, width, height] = size.split("x").map(Number);
      if (state.packages[index]) {
        state.packages[index] = {
          number,
          weight,
          length,
          width,
          height,
          items: [items],
        };
      }
    },
    copyCargoSpace: (state, action: PayloadAction<number>) => {
      const packageToCopy = state.packages[action.payload];
      if (packageToCopy) {
        state.packages.push({ ...packageToCopy });
      }
    },

    updateServices: (
      state,
      action: PayloadAction<{ code: string; parameter: string } | null>
    ) => {
      if (action.payload === null) {
        state.services = [];
      } else {
        const { code, parameter } = action.payload;
        state.services = [{ code, parameter }];
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
  updateServices,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
