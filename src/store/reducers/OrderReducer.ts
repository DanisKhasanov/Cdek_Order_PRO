import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { setNameProduct } from "./SettingReducer";

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
  weight: number;
  length: number;
  width: number;
  height: number;
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
      action.payload.forEach((pkg: any) => {
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

    updateCargoSpaces: (state, action: PayloadAction<{
      fromPackage: Package;
      toPackage: Package;
    }>) => {
      const { fromPackage, toPackage } = action.payload;
    
      // Обновляем исходное грузовое место
      state.packages = state.packages.map((pkg) =>
        pkg.number === fromPackage.number ? fromPackage : pkg
      );
    
      // Обновляем целевое грузовое место
      state.packages = state.packages.map((pkg) =>
        pkg.number === toPackage.number ? toPackage : pkg
      );
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
  setPhoneAccount,
  setRecipientName,
  setRecipientPhone,
  setRecipientAddress,
  addCargoSpace,
  updateCargoSpaces,
  removeCargoSpace,
  // editCargoSpace,
  copyCargoSpace,
  updateServices,
} = orderFormSlice.actions;
export default orderFormSlice.reducer;
