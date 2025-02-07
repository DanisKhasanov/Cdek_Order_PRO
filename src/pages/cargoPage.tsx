import { addCargoSpace, updateOrderForm } from "../store/reducers/OrderReducer";
import { GetCargoSpace, GetDataCity } from "../api/api";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { LoadingSpinner } from "../helpers/loadingSpinner";
import AddedCargo from "../components/cargo/addedCargo";
import FormInputsCargo from "../components/cargo/formInputsCargo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";

const Cargo = () => {
  const [loading, setLoading] = useState(true);
  const orderData = useSelector((state: RootState) => state.orderForm);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orderData.counterParty) {
      getDataOrder();
    }
  }, []);

  const getDataOrder = async () => {
    try {
      if (orderData.toLocation.code === 0) {
        const response = await GetDataCity({
          toLocation: {
            postalCode: orderData.toLocation.postalCode,
            city: orderData.toLocation.city,
          },
        });
        const cod = orderData.cod && response.cod ? true : false;
        if (response) {
          dispatch(
            updateOrderForm({
              ...orderData,
              toLocation: { ...orderData.toLocation, code: response.code },
              cod: cod,
            })
          );
        }
      }
      if (orderData.packages.length === 0) {
        const cargoSpace = await GetCargoSpace(orderData);
        if (cargoSpace) {
          dispatch(addCargoSpace(cargoSpace));
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box padding={5}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <AddedCargo />
          <FormInputsCargo />
        </>
      )}
    </Box>
  );
};

export default Cargo;
