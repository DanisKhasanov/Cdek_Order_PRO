import { configureStore } from "@reduxjs/toolkit";
import orderFormReducer from "./reducers/OrderReducer";
import cargoSpaceReducer from "./reducers/CargoSpaceReducer";

const store = configureStore({
  reducer: {
    orderForm: orderFormReducer,
    cargoSpace: cargoSpaceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
