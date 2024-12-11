import { updateOrderForm } from "../store/reducers/OrderReducer";
import { GetDataCity } from "../api/api";
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
      const response = await GetDataCity(
        {
          toLocation: {
            postalCode: orderData.to_location.postal_code,
            city: orderData.to_location.city,
          },
        },
        orderData.accountId
      );
      const cod = orderData.cod && response.cod ? true : false;
      if (response) {
        dispatch(
          updateOrderForm({
            ...orderData,
            to_location: { ...orderData.to_location, code: response.code },
            cod: cod,
          })
        );
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
