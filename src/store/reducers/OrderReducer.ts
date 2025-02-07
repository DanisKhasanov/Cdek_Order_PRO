import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { setNameProduct } from "./SettingReducer";

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

interface Positions {
  quantity: number;
  price: number;
  vat: number;
  name: string;
  code: string;
  weight: number;
}

interface OrderFormState {
  number: string;
  // account: string;
  // accountId: string;
  sender: {
    phones: [{ number: string }];
  };
  recipient: {
    name: string;
    phones: [{ number: string }];
  };
  fromLocation: {
    code: number;
    city: string;
    postalCode: string;
    address: string;
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
  positions: Positions[];
  weight: number;
}

const initialState: OrderFormState = {
  number: "",
  // account: "",
  // accountId: "",
  sender: {
    phones: [{ number: "" }],
  },
  recipient: {
    name: "",
    phones: [{ number: "" }],
  },
  fromLocation: {
    code: 0,
    city: "",
    postalCode: "",
    address: "",
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
  counterParty: true,
  positions: [],
  weight: 0,
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

    // setAccount: (state, action: PayloadAction<string>) => {
    //   state.account = action.payload;
    // },

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

    addCargoSpace: (state, action: PayloadAction<Package[]>) => {
      action.payload.forEach((pkg: any, index: number) => {
        state.packages.push({
          number: pkg.number,
          weight: pkg.weight,
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
          items: pkg.items.map((item: any) => ({
            name: item.name,
            ware_key: item.ware_key,
            marking: item.marking,
            weight: item.weight,
            amount: item.amount,
            payment: {
              value: state.cod ? item.payment.value : 0,
            },
            cost: item.cost,
          })),
        });
      });
    },

    removeCargoSpace: (state, action: PayloadAction<number>) => {
      state.packages = state.packages.filter(
        (_, index) => index !== action.payload
      );
    },

    // editCargoSpace: (
    //   state,
    //   action: PayloadAction<{
    //     index: number;
    //     weight: number;
    //     size: string;
    //     items: PackageItem;
    //   }>
    // ) => {
    //   const { index, weight, size } = action.payload;
    //   const [length, width, height] = size.split("x").map(Number);

    //   if (state.packages[index]) {
    //     // const totalPackages = state.packages.length;
    //     // const costPerPackage = 100 / totalPackages;

    //     const items = {
    //       name: state.packages[index].items[0].name,
    //       wareKey: "1",
    //       weight: weight,
    //       marking: (index + 1).toString(),
    //       amount: 1,
    //       payment: {
    //         value: state.cod === false ? 0 : state.sum,
    //       },
    //       cost: action.payload.items.cost,
    //     };

    //     state.packages[index] = {
    //       number: state.packages.length.toString(),
    //       weight,
    //       length,
    //       width,
    //       height,
    //       items: [items],
    //     };
    //   }
    // },

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
  // setAccount,
  setPhoneAccount,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
  addCargoSpace,
  removeCargoSpace,
  // editCargoSpace,
  copyCargoSpace,
  updateServices,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
