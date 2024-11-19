import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Box {
  id: number;
  length: number  ;
  width: number;
  height: number;
}

interface SettingState {
  accountId: string;
  key_api: string;
  password_api: string;
  type_order: string; //будет 1 или 2
  type_shipment: string;
  address_shipment: string;
  boxes: Box[];
  name_product: string;
  declared_cost: number;
}

const initialState: SettingState = {
  accountId: "",
  key_api: "",
  password_api: "",
  type_order: "",
  type_shipment: "",
  address_shipment: "",
  boxes: [{ id: 1, length: 0, width: 0, height: 0 }],
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
    setTypeShipment: (state, action: PayloadAction<string>) => {
      state.type_shipment = action.payload;
    },
    setAddressShipment: (state, action: PayloadAction<string>) => {
      state.address_shipment = action.payload;
    },
    setBoxes: (state, action: PayloadAction<Box[]>) => {
      state.boxes = action.payload;
    },
    removeBox: (state, action: PayloadAction<number>) => {
      state.boxes = state.boxes.filter((_,index) => index !== action.payload);
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
  setTypeShipment,
  setAddressShipment,
  setBoxes,
  removeBox,
  setNameProduct,
  setDeclaredCost,
} = settingSlice.actions;
export default settingSlice.reducer;
