
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderFormState {
  contract: string;
  recipientName: string;
  phoneNumber: number;
  city: string;
  address: string;
}

const initialState: OrderFormState = {
  contract: '',
  recipientName: '',
  phoneNumber: 0,
  city: '',
  address: '',
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
