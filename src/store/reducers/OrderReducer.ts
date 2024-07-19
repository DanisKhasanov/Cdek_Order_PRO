
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderFormState {
  number: string;
  recipient: {
    name: string;
    phones: { number: string }[];
  };
  to_location: {
    code: number;
    city: string;
    address: string;
  };
  comment: string;
  cod: boolean;
  sum: number;
}

const initialState: OrderFormState = {
  number: '',
  recipient: {
    name: '',
    phones: [{ number: '' }],
  },
  to_location: {
    code: 0,
    city: '',
    address: '',
  },
  comment: '',
  cod: false,
  sum: 0,
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
