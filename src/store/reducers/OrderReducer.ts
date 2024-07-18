
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderFormState {
  contract: string;
  recipientName: string;
  phoneNumber: string;
  city: string;
  address: string;
  payment: number;
  weight: number;
}

const initialState: OrderFormState = {
  contract: '',
  recipientName: '',
  phoneNumber: '',
  city: '',
  address: '',
  payment: 0,
  weight: 0,
};

const orderFormSlice = createSlice({
  name: 'orderForm',
  initialState,
  reducers: {
    updateOrderForm: (state, action: PayloadAction<Partial<OrderFormState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { updateOrderForm } = orderFormSlice.actions;
export default orderFormSlice.reducer;
