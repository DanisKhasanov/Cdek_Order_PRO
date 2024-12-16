import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setNameProduct } from "./SettingReducer";

interface PackageItem {
  name: string;
  wareKey: string;
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
  accountId: string;
  sender: {
    phones: [{ number: string }];
  };
  recipient: {
    name: string;
    phones: [{ number: string }];
  };
  toLocation: {
    code: number;
    city: string;
    postalCode: string;
    address: string;
  };
  packages: Package[];
  comment: string;
  commentDelivery: string;
  deliveryPoint: string;
  deliveryPointAddress: any;
  tariffCode: number;
  services: { code: string; parameter: string }[] | [];
  cod: boolean;
  sum: number;
  deliveryRecipientCost: {
    value: number;
  };
  orderCreated: boolean;
  counterParty: boolean;
}

const initialState: OrderFormState = {
  number: "",
  account: "",
  accountId: "",
  sender: {
    phones: [{ number: "" }],
  },
  recipient: {
    name: "",
    phones: [{ number: "" }],
  },
  toLocation: {
    code: 0,
    city: "",
    postalCode: "",
    address: "",
  },
  packages: [],
  comment: "",
  commentDelivery: "",
  deliveryPoint: "",
  deliveryPointAddress: {},
  tariffCode: 0,
  services: [],
  cod: false,
  sum: 0,
  deliveryRecipientCost: {
    value: 0,
  },
  orderCreated: false,
  counterParty: false,
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

    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },

    setPhoneAccount: (state, action: PayloadAction<string>) => {
      state.sender.phones[0].number = action.payload;
    },

    setRecipientName: (state, action: PayloadAction<string>) => {
      state.recipient.name = action.payload;
    },

    setRecipientPhone: (state, action: PayloadAction<string>) => {
      state.recipient.phones[0].number = action.payload;
    },

    setRecipientAddress: (
      state,
      action: PayloadAction<{
        address: string;
        postal_code: string;
        city: string;
      }>
    ) => {
      state.toLocation.address = action.payload.address;
      state.toLocation.postalCode = action.payload.postal_code;
      state.toLocation.city = action.payload.city;
    },

    addCargoSpace: (
      state,
      action: PayloadAction<{
        weight: number;
        size: string;
        items: PackageItem;
      }>
    ) => {
      const { weight, size } = action.payload;
      const [length, width, height] = size.split("x").map(Number);

      const totalPackages = state.packages.length + 1;

      const items = {
        name: action.payload.items.name,
        wareKey: "1",
        weight: weight,
        marking: totalPackages.toString(),
        amount: 1,
        payment: {
          value: state.cod === false ? 0 : state.sum,
        },
        cost: action.payload.items.cost,
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
        // const totalPackages = state.packages.length;
        // const costPerPackage = 100 / totalPackages;

        const items = {
          name: state.packages[index].items[0].name,
          wareKey: "1",
          weight: weight,
          marking: (index + 1).toString(),
          amount: 1,
          payment: {
            value: state.cod === false ? 0 : state.sum,
          },
          cost: action.payload.items.cost,
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
  setAccount,
  setPhoneAccount,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
  addCargoSpace,
  removeCargoSpace,
  editCargoSpace,
  copyCargoSpace,
  updateServices,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
