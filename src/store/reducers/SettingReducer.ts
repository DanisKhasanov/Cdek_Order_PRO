import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Box {
  id: number;
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface SettingState {
  accountId: string;
  key_api: string;
  password_api: string;
  name_sender: string;
  type_order: string; //будет 1 или 2
  type_shipment: string;
  date_shipment: string;
  time_shipment: string;
  comment: string;
  city_shipment: string;
  address_shipment: string;
  phone: string;
  boxes: Box[];
  name_product: string;
  declared_cost: number;
}

const initialState: SettingState = {
  accountId: "",
  key_api: "",
  password_api: "",
  type_order: "",
  name_sender: "",
  type_shipment: "",
  date_shipment: "",
  time_shipment: "",
  comment: "",
  city_shipment: "",
  address_shipment: "",
  phone: "",
  boxes: [{ id: 1, weight: 0, length: 0, width: 0, height: 0 }],
  name_product: "",
  declared_cost: 0,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },
    setKeyApi: (state, action: PayloadAction<string>) => {
      state.key_api = action.payload;
    },
    setPasswordApi: (state, action: PayloadAction<string>) => {
      state.password_api = action.payload;
    },
    setTypeOrder: (state, action: PayloadAction<string>) => {
      state.type_order = action.payload;
    },
    setNameSender: (state, action: PayloadAction<string>) => {
      state.name_sender = action.payload;
    },
    setTypeShipment: (state, action: PayloadAction<string>) => {
      state.type_shipment = action.payload;
    },
    setDateShipment: (state, action: PayloadAction<string>) => {
      state.date_shipment = action.payload;
    },
    setTimeShipter: (state, action: PayloadAction<string>) => {
      state.time_shipment = action.payload;
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    setCityShipment: (state, action: PayloadAction<string>) => {
      state.city_shipment = action.payload;
    },
    setAddressShipment: (state, action: PayloadAction<string>) => {
      state.address_shipment = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setBoxes: (state, action: PayloadAction<Box[]>) => {
      state.boxes = action.payload;
    },
    removeBox: (state, action: PayloadAction<number>) => {
      state.boxes = state.boxes.filter((_, index) => index !== action.payload);
    },
    setNameProduct: (state, action: PayloadAction<string>) => {
      state.name_product = action.payload;
    },
    setDeclaredCost: (state, action: PayloadAction<number>) => {
      state.declared_cost = action.payload;
    },
  },
});

export const {
  setAccountId,
  setKeyApi,
  setPasswordApi,
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
