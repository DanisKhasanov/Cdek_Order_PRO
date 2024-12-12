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
  keyApi: string;
  passwordApi: string;
  nameSender: string;
  typeOrder: string; //будет 1 или 2
  typeShipment: string;
  dateShipment: string;
  timeShipment: string;
  comment: string;
  cityShipment: string;
  addressShipment: string;
  phone: string;
  boxes: Box[];
  nameProduct: string;
  declaredCost: number;
}

const initialState: SettingState = {
  accountId: "",
  keyApi: "",
  passwordApi: "",
  typeOrder: "",
  nameSender: "",
  typeShipment: "",
  dateShipment: "",
  timeShipment: "",
  comment: "",
  cityShipment: "",
  addressShipment: "",
  phone: "",
  boxes: [{ id: 1, weight: 0, length: 0, width: 0, height: 0 }],
  nameProduct: "",
  declaredCost: 0,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setAccountId: (state, action: PayloadAction<string>) => {
      state.accountId = action.payload;
    },
    setKeyApi: (state, action: PayloadAction<string>) => {
      state.keyApi = action.payload;
    },
    setPasswordApi: (state, action: PayloadAction<string>) => {
      state.passwordApi = action.payload;
    },
    setTypeOrder: (state, action: PayloadAction<string>) => {
      state.typeOrder = action.payload;
    },
    setNameSender: (state, action: PayloadAction<string>) => {
      state.nameSender = action.payload;
    },
    setTypeShipment: (state, action: PayloadAction<string>) => {
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
      state.cityShipment = action.payload;
    },
    setAddressShipment: (state, action: PayloadAction<string>) => {
      state.addressShipment = action.payload;
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
      state.nameProduct = action.payload;
    },
    setDeclaredCost: (state, action: PayloadAction<number>) => {
      state.declaredCost = action.payload;
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
