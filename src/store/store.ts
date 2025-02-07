import { configureStore } from "@reduxjs/toolkit";
import orderFormReducer from "./reducers/OrderReducer";
// import settingReducer from "./reducers/SettingReducer";

const store = configureStore({
  reducer: {
    orderForm: orderFormReducer,
    // setting: settingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
