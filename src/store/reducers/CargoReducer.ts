import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CargoSpace {
  id: number;
  weight: number;
  size: string;
}

interface CargoSpaceState {
  cargoSpaces: CargoSpace[];
}

const initialState: CargoSpaceState = {
  cargoSpaces: [],
};

const cargoSpaceSlice = createSlice({
  name: "cargoSpace",
  initialState,
  reducers: {
    addCargoSpace: (state, action: PayloadAction<CargoSpace>) => {
      state.cargoSpaces.push(action.payload);
    },
    removeCargoSpace: (state, action: PayloadAction<number>) => {
      state.cargoSpaces = state.cargoSpaces.filter(
        (cargoSpace) => cargoSpace.id !== action.payload
      );
    },
    editCargoSpace: (
      state,
      action: PayloadAction<{ id: number; weight: number; size: string }>
    ) => {
      const { id, weight, size } = action.payload;
      const cargoSpace = state.cargoSpaces.find(
        (cargoSpace) => cargoSpace.id === id
      );
      if (cargoSpace) {
        cargoSpace.weight = weight;
        cargoSpace.size = size;
      }
    },
    copyCargoSpace: (state, action: PayloadAction<number>) => {
      const cargoSpace = state.cargoSpaces.find(
        (cargoSpace) => cargoSpace.id === action.payload
      );
      if (cargoSpace) {
        state.cargoSpaces.push({
          ...cargoSpace,
          id: state.cargoSpaces.length + 1,
        });
      }
    },
  },
});

export const { addCargoSpace, removeCargoSpace, editCargoSpace , copyCargoSpace} =
  cargoSpaceSlice.actions;
export default cargoSpaceSlice.reducer;
