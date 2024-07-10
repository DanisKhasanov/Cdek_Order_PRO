
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CargoSpace {
  id: number;
  weight: number;
  dimensions: string;
}

interface CargoSpaceState {
  cargoSpaces: CargoSpace[];
}

const initialState: CargoSpaceState = {
  cargoSpaces: [],
};

const cargoSpaceSlice = createSlice({
  name: 'cargoSpace',
  initialState,
  reducers: {
    addCargoSpace: (state, action: PayloadAction<CargoSpace>) => {
      state.cargoSpaces.push(action.payload);
    },
    removeCargoSpace: (state, action: PayloadAction<number>) => {
      state.cargoSpaces = state.cargoSpaces.filter((cargoSpace) => cargoSpace.id !== action.payload);
    },
    editCargoSpace: (state, action: PayloadAction<{ id: number; weight: number; dimensions: string }>) => {
      const { id, weight, dimensions } = action.payload;
      const cargoSpace = state.cargoSpaces.find((cargoSpace) => cargoSpace.id === id);
      if (cargoSpace) {
        cargoSpace.weight = weight;
        cargoSpace.dimensions = dimensions;
      }
    },
  },
});

export const { addCargoSpace, removeCargoSpace, editCargoSpace } = cargoSpaceSlice.actions;
export default cargoSpaceSlice.reducer;
