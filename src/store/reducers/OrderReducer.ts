import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PackageItem {
  name: string;
  ware_key: string;
  marking: string;
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
  account: string;
  sender: {
    phones: [{ number: string }];
  };
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
  comment_delivery: string;
  delivery_point: string;
  delivery_point_address: any;
  tariff_code: number;
  services: { code: string; parameter: string }[] | [];
  cod: boolean;
  sum: number;
  delivery_recipient_cost: {
    value: number;
  };
  orderCreated: boolean;
  counterparty: boolean;
}

const initialState: OrderFormState = {
  number: "",
  account: "GRM",
  sender: {
    phones: [{ number: "" }],
  },
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
  comment_delivery: "",
  delivery_point: "",
  delivery_point_address: {},
  tariff_code: 0,
  services: [],
  cod: false,
  sum: 0,
  delivery_recipient_cost: {
    value: 0,
  },
  orderCreated: false,
  counterparty: false,
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
      const { index, weight, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);

      const totalPackages = state.packages.length + 1;
      const costPerPackage = totalPackages > 0 ? 100 : 0;

      const items = {
        name: "Стеклянные флаконы",
        ware_key: "1",
        weight: weight,
        marking: (index + 1).toString(),
        amount: 1,
        payment: {
          value: state.cod === false ? 0 : state.sum,
        },
        cost: costPerPackage,
      };

      state.packages.push({
        number: totalPackages.toString(),
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
      const { index, weight, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);

      if (state.packages[index]) {
        const totalPackages = state.packages.length;
        const costPerPackage = 100 / totalPackages;

        const items = {
          name: "Стеклянные флаконы",
          ware_key: "1",
          weight: weight,
          marking: (index + 1).toString(),
          amount: 1,
          payment: {
            value: state.cod === false ? 0 : state.sum,
          },
          cost: costPerPackage,
        };

        state.packages[index] = {
          number: state.packages.length.toString(),
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
        const totalPackages = state.packages.length;
        const newNumber = (totalPackages + 1).toString();
        state.packages.push({
          ...packageToCopy,
          number: newNumber,
          items: packageToCopy.items.map((item) => ({
            ...item,
            marking: `${newNumber}`,
          })),
        });
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
