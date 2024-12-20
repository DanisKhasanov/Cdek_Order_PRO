import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Box {
  id: number;
  maxWeight: number;
  length: number;
  width: number;
  height: number;
}

interface SettingState {
  accountId: string;
  cdekClientId: string;
  cdekClientSecret: string;
  moyskladToken: string;
  orderType: number;
  sender: {
    name: string;
    phones: [{ number: string }];
  };
  fromLocation: string;
  typeShipment: number;
  dateShipment: string;
  timeShipment: string;
  comment: string;
  addressShipment: string;
  boxesTypes: Box[];
  defaultProductName: string;
  defaultDeclaredCost: number;
}

const initialState: SettingState = {
  accountId: "",
  cdekClientId: "",
  cdekClientSecret: "",
  moyskladToken: "",
  orderType: 1,
  sender: { name: "", phones: [{ number: "" }] },
  fromLocation: "",
  typeShipment: 1,
  dateShipment: "",
  timeShipment: "",
  comment: "",
  addressShipment: "",
  boxesTypes: [{ id: 1, maxWeight: 0, length: 0, width: 0, height: 0 }],
  defaultProductName: "",
  defaultDeclaredCost: 0,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },
    setKeyApi: (state, action: PayloadAction<string>) => {
      state.cdekClientId = action.payload;
    },
    setPasswordApi: (state, action: PayloadAction<string>) => {
      state.cdekClientSecret = action.payload;
    },
    setTokenMS: (state, action: PayloadAction<string>) => {
      state.moyskladToken = action.payload;
    },
    setTypeOrder: (state, action: PayloadAction<number>) => {
      state.orderType = action.payload;
    },
    setNameSender: (state, action: PayloadAction<string>) => {
      state.sender.name = action.payload;
    },
    setTypeShipment: (state, action: PayloadAction<number>) => {
      state.typeShipment = action.payload;
    },
    setDateShipment: (state, action: PayloadAction<string>) => {
      state.dateShipment = action.payload;
    },
    setTimeShipter: (state, action: PayloadAction<string>) => {
      state.timeShipment = action.payload;
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    setCityShipment: (state, action: PayloadAction<string>) => {
      state.fromLocation = action.payload;
    },
    setAddressShipment: (state, action: PayloadAction<string>) => {
      state.addressShipment = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.sender.phones[0].number = action.payload;
    },
    setBoxes: (state, action: PayloadAction<Box[]>) => {
      state.boxesTypes = action.payload;
    },
    removeBox: (state, action: PayloadAction<number>) => {
      state.boxesTypes = state.boxesTypes.filter(
        (_, index) => index !== action.payload
      );
    },
    setNameProduct: (state, action: PayloadAction<string>) => {
      state.defaultProductName = action.payload;
    },
    setDeclaredCost: (state, action: PayloadAction<number>) => {
      state.defaultDeclaredCost = action.payload;
    },
 
  },
});

export const {
  setAccountId,
  setKeyApi,
  setPasswordApi,
  setTokenMS,
  setTypeOrder,
  setNameSender,
  setTypeShipment,
  setDateShipment,
  setTimeShipter,
  setComment,
  setCityShipment,
  setAddressShipment,
  setPhone,
  setBoxes,
  removeBox,
  setNameProduct,
  setDeclaredCost,
} = settingSlice.actions;
export default settingSlice.reducer;
